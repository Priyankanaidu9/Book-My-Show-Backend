import express from 'express';
import Movie from '../models/Movie.js';
import Theater from '../models/Theater.js';

const router = express.Router();

// @route   GET /api/movies
// @desc    Get movies filtered by city
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { city, status, search } = req.query;
    
    let query = {};
    
    // For array fields in MongoDB, direct equality checks if value exists in array
    if (city) {
      query.cities = city;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { genre: { $regex: search, $options: 'i' } }
      ];
    }

    const movies = await Movie.find(query).sort({ releaseDate: -1 });

    // For each movie, get theaters in the city
    const moviesWithTheaters = await Promise.all(
      movies.map(async (movie) => {
        const theaters = await Theater.find({
          city: city || { $exists: true }
        }).limit(6).select('name showtimes _id');

        return {
          ...movie.toObject(),
          theaters: theaters
        };
      })
    );

    res.json(moviesWithTheaters);
  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/movies/:id
// @desc    Get single movie with theaters
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { city } = req.query;
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Get theaters in the city
    const theaters = await Theater.find({
      city: city || { $exists: true }
    }).limit(6).select('name showtimes _id');

    res.json({
      ...movie.toObject(),
      theaters: theaters
    });
  } catch (error) {
    console.error('Get movie error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

