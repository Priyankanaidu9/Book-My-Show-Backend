import express from 'express';
import Booking from '../models/Booking.js';
import Theater from '../models/Theater.js';
import User from '../models/User.js';
import redisClient from '../config/redis.js';
import { authMiddleware } from '../middleware/auth.js';
import QRCode from 'qrcode';

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { movieId, theaterId, showtime, showDate, seats, amount, foodBeverage, paymentId } = req.body;

    if (!movieId || !theaterId || !showtime || !seats || !amount || !paymentId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Verify seats are still locked by this user
    const lockKey = `seats:lock:${theaterId}:${showtime}`;
    const userLockKey = `user:lock:${req.user.id}:${theaterId}:${showtime}`;
    
    const userSeats = await redisClient.get(userLockKey);
    if (!userSeats) {
      return res.status(400).json({ message: 'Seat lock expired. Please select seats again.' });
    }

    // Generate QR code
    const bookingData = {
      userId: req.user.id,
      movieId,
      theaterId,
      showtime,
      seats,
      timestamp: new Date().toISOString()
    };
    
    const qrCode = await QRCode.toDataURL(JSON.stringify(bookingData));

    // Create booking
    const booking = await Booking.create({
      userId: req.user.id,
      movieId,
      theaterId,
      showtime,
      showDate: new Date(showDate),
      seats,
      amount,
      foodBeverage: foodBeverage || { popcorn: 0, drinks: 0 },
      qrCode,
      paymentId
    });

    // Update theater seats to booked
    const theater = await Theater.findById(theaterId);
    if (theater) {
      seats.forEach(seat => {
        const row = theater.layout.find(r => r.row === seat.row);
        if (row) {
          const seatData = row.seats.find(s => s.seat === seat.seat);
          if (seatData) {
            seatData.status = 'booked';
          }
        }
      });
      await theater.save();
    }

    // Remove locks from Redis
    for (const seat of seats) {
      const seatKey = `${seat.row}-${seat.seat}`;
      await redisClient.hDel(lockKey, seatKey);
    }
    await redisClient.del(userLockKey);

    // Update user bookings
    await User.findByIdAndUpdate(req.user.id, {
      $push: { bookings: booking._id }
    });

    res.status(201).json({
      success: true,
      booking: await Booking.findById(booking._id)
        .populate('movieId', 'title posterUrl')
        .populate('theaterId', 'name')
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings/:userId
// @desc    Get user bookings
// @access  Private
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    if (req.params.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const bookings = await Booking.find({ userId: req.params.userId })
      .populate('movieId', 'title posterUrl genre')
      .populate('theaterId', 'name')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings/ticket/:bookingId
// @desc    Get booking ticket details
// @access  Private
router.get('/ticket/:bookingId', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate('movieId', 'title posterUrl genre duration')
      .populate('theaterId', 'name');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

