import express from 'express';

const router = express.Router();

const cities = [
  { id: 1, name: 'Mumbai' },
  { id: 2, name: 'Delhi' },
  { id: 3, name: 'Bangalore' },
  { id: 4, name: 'Chennai' },
  { id: 5, name: 'Hyderabad' },
  { id: 6, name: 'Pune' },
  { id: 7, name: 'Kolkata' },
  { id: 8, name: 'Ahmedabad' }
];

// @route   GET /api/cities
// @desc    Get all cities
// @access  Public
router.get('/', (req, res) => {
  res.json(cities);
});

export default router;

