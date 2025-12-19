import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  posterUrl: {
    type: String,
    required: true
  },
  genre: {
    type: [String],
    required: true,
    default: []
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  cities: {
    type: [String],
    required: true,
    default: []
  },
  releaseDate: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Now Showing', 'Coming Soon'],
    default: 'Now Showing'
  }
}, {
  timestamps: true
});

export default mongoose.model('Movie', movieSchema);

