import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  theaterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: true
  },
  showtime: {
    type: String,
    required: true
  },
  showDate: {
    type: Date,
    required: true
  },
  seats: [{
    row: String,
    seat: Number,
    price: Number,
    isPremium: Boolean
  }],
  amount: {
    type: Number,
    required: true
  },
  foodBeverage: {
    popcorn: { type: Number, default: 0 },
    drinks: { type: Number, default: 0 }
  },
  qrCode: {
    type: String,
    required: true
  },
  paymentId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  }
}, {
  timestamps: true
});

export default mongoose.model('Booking', bookingSchema);

