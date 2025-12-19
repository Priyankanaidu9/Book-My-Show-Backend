import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from '../models/Movie.js';
import Theater from '../models/Theater.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'];

const movies = [
  {
    title: 'Avengers: Endgame',
    posterUrl: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    rating: 4.8,
    duration: 181,
    cities: cities,
    releaseDate: new Date('2024-01-15'),
    description: 'The epic conclusion to the Infinity Saga',
    status: 'Now Showing'
  },
  {
    title: 'Spider-Man: No Way Home',
    posterUrl: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    genre: ['Action', 'Adventure', 'Fantasy'],
    rating: 4.7,
    duration: 148,
    cities: cities,
    releaseDate: new Date('2024-02-01'),
    description: 'Peter Parker seeks help from Doctor Strange',
    status: 'Now Showing'
  },
  {
    title: 'Dune',
    posterUrl: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    rating: 4.5,
    duration: 155,
    cities: cities,
    releaseDate: new Date('2024-02-10'),
    description: 'A noble family becomes embroiled in a war',
    status: 'Now Showing'
  },
  {
    title: 'The Matrix Resurrections',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8c4a8kE7PizaGQQvfItXQxVXj4i.jpg',
    genre: ['Action', 'Sci-Fi', 'Thriller'],
    rating: 4.2,
    duration: 148,
    cities: cities,
    releaseDate: new Date('2024-01-20'),
    description: 'Return to the Matrix',
    status: 'Now Showing'
  },
  {
    title: 'No Time to Die',
    posterUrl: 'https://image.tmdb.org/t/p/w500/iUgygt3fscRoKWCV1d0C7FbM9TP.jpg',
    genre: ['Action', 'Thriller', 'Adventure'],
    rating: 4.3,
    duration: 163,
    cities: cities,
    releaseDate: new Date('2024-01-25'),
    description: 'James Bond\'s final mission',
    status: 'Now Showing'
  },
  {
    title: 'Top Gun: Maverick',
    posterUrl: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
    genre: ['Action', 'Drama'],
    rating: 4.6,
    duration: 130,
    cities: cities,
    releaseDate: new Date('2024-02-05'),
    description: 'Pete "Maverick" Mitchell trains a new generation',
    status: 'Now Showing'
  },
  {
    title: 'Black Widow',
    posterUrl: 'https://image.tmdb.org/t/p/w500/qAZ0pzat4k9y3JTvxli1M7n1c2x.jpg',
    genre: ['Action', 'Adventure', 'Thriller'],
    rating: 4.1,
    duration: 134,
    cities: cities,
    releaseDate: new Date('2024-02-15'),
    description: 'Natasha Romanoff confronts her past',
    status: 'Now Showing'
  },
  {
    title: 'Eternals',
    posterUrl: 'https://image.tmdb.org/t/p/w500/6AdXwFTRTAzggD2QUTt5B7JFGKL.jpg',
    genre: ['Action', 'Adventure', 'Fantasy'],
    rating: 4.0,
    duration: 157,
    cities: cities,
    releaseDate: new Date('2024-02-20'),
    description: 'Immortal beings protect Earth',
    status: 'Now Showing'
  },
  {
    title: 'Shang-Chi',
    posterUrl: 'https://image.tmdb.org/t/p/w500/1BIoJGKbXjdFDAqUEiA2VHqkK1Z.jpg',
    genre: ['Action', 'Adventure', 'Fantasy'],
    rating: 4.4,
    duration: 132,
    cities: cities,
    releaseDate: new Date('2024-02-25'),
    description: 'Master of unarmed weaponry-based Kung Fu',
    status: 'Now Showing'
  },
  {
    title: 'Doctor Strange 2',
    posterUrl: 'https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamX371zA3s0o0qhj.jpg',
    genre: ['Action', 'Adventure', 'Fantasy'],
    rating: 4.3,
    duration: 126,
    cities: cities,
    releaseDate: new Date('2024-03-01'),
    description: 'Travel into the multiverse',
    status: 'Coming Soon'
  },
  {
    title: 'Thor: Love and Thunder',
    posterUrl: 'https://image.tmdb.org/t/p/w500/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg',
    genre: ['Action', 'Adventure', 'Comedy'],
    rating: 4.2,
    duration: 119,
    cities: cities,
    releaseDate: new Date('2024-03-10'),
    description: 'Thor embarks on a journey unlike any before',
    status: 'Coming Soon'
  },
  {
    title: 'Black Panther: Wakanda Forever',
    posterUrl: 'https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg',
    genre: ['Action', 'Adventure', 'Drama'],
    rating: 4.5,
    duration: 161,
    cities: cities,
    releaseDate: new Date('2024-03-15'),
    description: 'Wakanda fights to protect their nation',
    status: 'Coming Soon'
  }
];

const theaterNames = [
  'PVR Cinemas',
  'INOX',
  'Cinepolis',
  'Miraj Cinemas',
  'Carnival Cinemas',
  'Fun Cinemas'
];

// Generate theater layout (10 rows A-J, 12 seats per row)
const generateLayout = () => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const layout = rows.map((row, rowIndex) => {
    const seats = [];
    for (let i = 1; i <= 12; i++) {
      // Premium seats: rows A, B, I, J (first 2 and last 2 rows)
      const isPremium = rowIndex < 2 || rowIndex >= 8;
      seats.push({
        seat: i,
        status: Math.random() > 0.7 ? 'booked' : 'available', // 30% booked
        price: isPremium ? 180 : 150,
        isPremium
      });
    }
    return { row, seats };
  });
  return layout;
};

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookmyshow');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Movie.deleteMany({});
    await Theater.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Seed movies
    const createdMovies = await Movie.insertMany(movies);
    console.log(`✅ Created ${createdMovies.length} movies`);

    // Seed theaters for each city
    const theaters = [];
    for (const city of cities) {
      for (let i = 0; i < 6; i++) {
        const theater = await Theater.create({
          name: `${theaterNames[i % theaterNames.length]} ${city}`,
          city,
          layout: generateLayout(),
          showtimes: ['10:00', '13:00', '16:00', '19:00', '22:00']
        });
        theaters.push(theater);
      }
    }
    console.log(`✅ Created ${theaters.length} theaters`);

    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 12);
    const testUser = await User.findOneAndUpdate(
      { email: 'test@example.com' },
      {
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword
      },
      { upsert: true, new: true }
    );
    console.log('✅ Created test user: test@example.com / password123');

    console.log('🎉 Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();

