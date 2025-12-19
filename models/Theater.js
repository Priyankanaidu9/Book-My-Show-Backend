import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  seat: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'booked', 'locked'],
    default: 'available'
  },
  price: {
    type: Number,
    required: true,
    default: 150
  },
  isPremium: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const rowSchema = new mongoose.Schema({
  row: {
    type: String,
    required: true
  },
  seats: [seatSchema]
}, { _id: false });

const theaterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true
  },
  layout: {
    type: [rowSchema],
    required: true
  },
  showtimes: {
    type: [String],
    default: ['10:00', '13:00', '16:00', '19:00', '22:00']
  }
}, {
  timestamps: true
});

export default mongoose.model('Theater', theaterSchema);

