require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cineflow';

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const movieSchema = new mongoose.Schema({
  id: Number,
  title: String,
  genre: String,
  price: Number,
  rating: Number,
  duration: String,
  director: String,
  cast: [String],
  description: String,
  image: String,
  trailer: String,
  hero: Boolean
});

const theaterSchema = new mongoose.Schema({
  id: Number,
  name: String,
  location: String,
  features: [String],
  rating: Number,
  image: String,
  showtimes: [String]
});

const bookingSchema = new mongoose.Schema({
  userEmail: String,
  title: String,
  theater: String,
  time: String,
  date: String,
  seats: [String],
  total: Number,
  addons: [String],
  parking: String,
  paymentMode: String,
  bookedOn: String
});

const Movie = mongoose.model('Movie', movieSchema);
const Theater = mongoose.model('Theater', theaterSchema);
const Booking = mongoose.model('Booking', bookingSchema);

app.get('/api/movies', async (req, res) => {
  const movies = await Movie.find();
  res.json(movies);
});

app.get('/api/theaters', async (req, res) => {
  const theaters = await Theater.find();
  res.json(theaters);
});

app.get('/api/bookings', async (req, res) => {
  const bookings = await Booking.find().sort({ bookedOn: -1 });
  res.json(bookings);
});

app.post('/api/bookings', async (req, res) => {
  try {
    const b = new Booking(req.body);
    const saved = await b.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));
