import express from 'express';
import Theater from '../models/Theater.js';
import redisClient from '../config/redis.js';
import { authMiddleware } from '../middleware/auth.js';


const router = express.Router();

// @route   GET /api/seats
// @desc    Get seats for a theater and showtime
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { theaterId, showtime } = req.query;

    if (!theaterId || !showtime) {
      return res.status(400).json({ message: 'Theater ID and showtime are required' });
    }

    const theater = await Theater.findById(theaterId);
    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }

    if (!theater.layout || theater.layout.length === 0) {
      return res.status(404).json({ message: 'Theater layout not found. Please seed the database.' });
    }

    // Get locked seats from Redis (if available)
    const lockKey = `seats:lock:${theaterId}:${showtime}`;
    let lockedSeats = {};
    try {
      const isOpen = redisClient.isOpen || redisClient.isReady;
      if (isOpen) {
        lockedSeats = await redisClient.hGetAll(lockKey);
      }
    } catch (error) {
      // Redis not available - continue without lock data
      console.warn('Redis not available, continuing without lock data');
    }

    // Map layout with locked seats
    const seats = theater.layout.map(row => ({
      row: row.row,
      seats: row.seats.map(seat => {
        const seatKey = `${row.row}-${seat.seat}`;
        const isLocked = lockedSeats[seatKey] ? true : false;
        
        return {
          seat: seat.seat,
          status: isLocked ? 'locked' : seat.status,
          price: seat.price,
          isPremium: seat.isPremium
        };
      })
    }));

    res.json(seats);
  } catch (error) {
    console.error('Get seats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/seats/lock
// @desc    Lock seats for 5 minutes
// @access  Private
router.post('/lock', authMiddleware, async (req, res) => {
  try {
    const { seats, theaterId, showtime } = req.body;

    if (!seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: 'Seats array is required' });
    }

    if (!theaterId || !showtime) {
      return res.status(400).json({ message: 'Theater ID and showtime are required' });
    }

    if (seats.length > 10) {
      return res.status(400).json({ message: 'Maximum 10 seats can be selected' });
    }

    const theater = await Theater.findById(theaterId);
    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }

    const lockKey = `seats:lock:${theaterId}:${showtime}`;
    const userLockKey = `user:lock:${req.user.id}:${theaterId}:${showtime}`;

    // Check if any seat is already locked or booked
    const existingLocks = await redisClient.hGetAll(lockKey);
    const conflicts = [];

    for (const seat of seats) {
      const seatKey = `${seat.row}-${seat.seat}`;
      
      // Check Redis locks
      if (existingLocks[seatKey] && existingLocks[seatKey] !== req.user.id) {
        conflicts.push(seatKey);
        continue;
      }

      // Check database for booked seats
      const rowData = theater.layout.find(r => r.row === seat.row);
      if (rowData) {
        const seatData = rowData.seats.find(s => s.seat === seat.seat);
        if (seatData && seatData.status === 'booked') {
          conflicts.push(seatKey);
        }
      }
    }

    if (conflicts.length > 0) {
      return res.status(409).json({ 
        message: 'Some seats are already taken',
        conflicts 
      });
    }

    // Lock seats in Redis with 5 minute TTL
    const lockData = {};
    const userSeats = [];
    
    for (const seat of seats) {
      const seatKey = `${seat.row}-${seat.seat}`;
      lockData[seatKey] = req.user.id;
      userSeats.push(seatKey);
    }

    await redisClient.hSet(lockKey, lockData);
    await redisClient.expire(lockKey, 300); // 5 minutes

    // Store user's locked seats
    await redisClient.setEx(userLockKey, 300, JSON.stringify(seats));

    res.json({
      success: true,
      message: 'Seats locked for 5 minutes',
      expiresAt: new Date(Date.now() + 300000)
    });
  } catch (error) {
    console.error('Lock seats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/seats/unlock
// @desc    Unlock seats
// @access  Private
router.post('/unlock', authMiddleware, async (req, res) => {
  try {
    const { theaterId, showtime } = req.body;

    const lockKey = `seats:lock:${theaterId}:${showtime}`;
    const userLockKey = `user:lock:${req.user.id}:${theaterId}:${showtime}`;

    // Get user's locked seats
    const userSeats = await redisClient.get(userLockKey);
    if (userSeats) {
      const seats = JSON.parse(userSeats);
      
      // Remove user's locks
      for (const seat of seats) {
        const seatKey = `${seat.row}-${seat.seat}`;
        await redisClient.hDel(lockKey, seatKey);
      }
      
      await redisClient.del(userLockKey);
    }

    res.json({ success: true, message: 'Seats unlocked' });
  } catch (error) {
    console.error('Unlock seats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

