import redisClient from '../config/redis.js';
import Theater from '../models/Theater.js';

export const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join room for a specific theater and showtime
    socket.on('join-theater', async ({ theaterId, showtime }) => {
      const room = `theater:${theaterId}:${showtime}`;
      socket.join(room);
      console.log(`Socket ${socket.id} joined room: ${room}`);

      // Send current seat status
      try {
        const theater = await Theater.findById(theaterId);
        if (theater) {
          const lockKey = `seats:lock:${theaterId}:${showtime}`;
          const lockedSeats = await redisClient.hGetAll(lockKey);

          const seats = theater.layout.map(row => ({
            row: row.row,
            seats: row.seats.map(seat => {
              const seatKey = `${row.row}-${seat.seat}`;
              return {
                seat: seat.seat,
                status: lockedSeats[seatKey] ? 'locked' : seat.status,
                price: seat.price,
                isPremium: seat.isPremium
              };
            })
          }));

          socket.emit('seat-update', seats);
        }
      } catch (error) {
        console.error('Error sending initial seat status:', error);
      }
    });

    // Handle seat selection
    socket.on('seat-selected', async ({ theaterId, showtime, seat }) => {
      const room = `theater:${theaterId}:${showtime}`;
      
      // Broadcast to all clients in the room
      socket.to(room).emit('seat-locked', {
        row: seat.row,
        seat: seat.seat,
        status: 'locked'
      });
    });

    // Handle seat deselection
    socket.on('seat-deselected', async ({ theaterId, showtime, seat }) => {
      const room = `theater:${theaterId}:${showtime}`;
      
      socket.to(room).emit('seat-unlocked', {
        row: seat.row,
        seat: seat.seat,
        status: 'available'
      });
    });

    // Handle booking confirmation
    socket.on('booking-confirmed', async ({ theaterId, showtime, seats }) => {
      const room = `theater:${theaterId}:${showtime}`;
      
      // Broadcast booked seats to all clients
      io.to(room).emit('seats-booked', seats);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

