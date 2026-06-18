# CineFlow - Extended Appendices (Detailed Edition)

**Last Updated**: April 2025  
**Version**: 1.0.0 Extended  
**Document Purpose**: Comprehensive technical reference with deep-dive details

---

## Appendix A1: API Architecture & Design Patterns

### RESTful API Design Philosophy

CineFlow API follows industry-standard REST conventions:

**HTTP Methods Used**:
- **GET**: Retrieve data (safe, idempotent)
- **POST**: Create resources (non-idempotent)
- **PUT**: Update resources (idempotent)
- **DELETE**: Remove resources (idempotent)

**URL Structure**:
```
/api/{resource}/{id}
/api/movies
/api/movies/1
/api/theaters
/api/bookings
```

**Response Format**:
- All responses are JSON
- Consistent error messages
- Include metadata (timestamps, status codes)

---

### Complete Booking Flow - Request/Response Lifecycle

#### Step 1: Fetch Movies
```javascript
// Frontend Request
GET /api/movies HTTP/1.1
Host: localhost:4000
Accept: application/json

// Response Timeline
1. Browser sends request
2. Server queries MongoDB
3. Server applies filters (if any)
4. Returns 200 OK with movie data
5. Frontend renders movie grid
```

#### Step 2: User Selects Movie & Theatre
```javascript
// User clicks "Book Now" for movie ID 1
openBooking(1);

// Frontend fetches specific movie details
GET /api/movies/1 HTTP/1.1

// Store selected movie
currentMovie = movies.find(m => m.id === 1);
```

#### Step 3: Seat Selection
```javascript
// Frontend does NOT need API call for seat selection
// Seats are computed client-side based on:
1. Theater capacity (fixed schema)
2. Random occupancy simulation (15% booked)
3. User selections (interactive)

// Selected seats stored in memory
selectedSeats = ["P1", "P2", "P3"];
```

#### Step 4: Payment & Confirmation
```javascript
// Create Booking Request
POST /api/bookings HTTP/1.1
Host: localhost:4000
Content-Type: application/json

{
  "userEmail": "user@example.com",
  "title": "Dune: Part Two",
  "theater": "PVR: Citi Mall",
  "time": "08:30 AM",
  "date": "15 April 2025",
  "seats": ["P1", "P2", "P3"],
  "total": 1050,
  "addons": ["Popcorn (Large)", "Coke (Large)"],
  "parking": "Standard",
  "paymentMode": "UPI"
}

// Server Processing
1. Validate all fields (email, movie exists, theater exists)
2. Check seat availability (conflict detection)
3. Calculate final amount with validations
4. Insert booking into MongoDB
5. Return 201 Created with booking ID
```

---

## Appendix A2: Advanced API Scenarios

### Scenario 1: Multi-Seat Booking with Conflict Handling

```javascript
// Frontend attempts to book 5 seats
const bookingRequest = {
  userEmail: "user@example.com",
  title: "Dune: Part Two",
  theater: "PVR: Citi Mall",
  time: "08:30 AM",
  date: "15 April 2025",
  seats: ["P1", "P2", "P3", "P4", "P5"],  // 5 seats
  total: 1750,
  addons: ["Popcorn (Large)", "Coke"],
  parking: "Premium",
  paymentMode": "Card"
};

// Server validation logic
const theatreBookings = await Booking.find({
  theater: "PVR: Citi Mall",
  time: "08:30 AM",
  date: "15 April 2025"
});

const bookedSeats = theatreBookings.flatMap(b => b.seats);
// bookedSeats = ["A1", "A2", "B5", "P1", "P2"]

const requestedSeats = ["P1", "P2", "P3", "P4", "P5"];
const conflicts = requestedSeats.filter(s => bookedSeats.includes(s));
// conflicts = ["P1", "P2"]

if (conflicts.length > 0) {
  return {
    status: 409,
    error: "Booking conflict",
    message: `Seats ${conflicts.join(', ')} are no longer available`,
    availableAlternates: ["P6", "P7", "P8"],
    unavailableSeats: conflicts
  };
}

// No conflicts - proceed with booking
const booking = new Booking(bookingRequest);
await booking.save();
return { status: 201, booking };
```

---

### Scenario 2: Error Handling & Retry Logic

```javascript
// Frontend with retry logic
async function bookWithRetry(bookingData, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        const booking = await response.json();
        console.log('✓ Booking successful on attempt', attempt);
        return booking;
      }

      if (response.status === 409) {
        const error = await response.json();
        console.error('Conflict:', error.message);
        // Get alternate seats
        const alternates = error.availableAlternates;
        throw new Error(`Please select from: ${alternates.join(', ')}`);
      }

      if (response.status === 400) {
        const error = await response.json();
        console.error('Validation error:', error.details);
        throw error;  // Don't retry validation errors
      }

      // Retry on 500 errors
      if (response.status >= 500 && attempt < maxRetries) {
        console.warn(`Server error (attempt ${attempt}/${maxRetries}), retrying...`);
        await new Promise(r => setTimeout(r, 1000 * attempt));  // Exponential backoff
        continue;
      }

      throw new Error(`HTTP ${response.status}`);

    } catch (error) {
      if (attempt === maxRetries) throw error;
      console.warn(`Attempt ${attempt} failed:`, error.message);
    }
  }
}
```

---

## Appendix B1: MongoDB Schema Deep Dive

### Complete Schema Definitions with Indexes

#### Movies Collection Schema

```javascript
const movieSchema = new mongoose.Schema({
  // Core identity
  id: {
    type: Number,
    required: true,
    unique: true,
    description: "Unique movie identifier"
  },
  
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 200,
    description: "Movie title",
    index: true  // For search queries
  },
  
  // Content metadata
  genre: {
    type: String,
    required: true,
    enum: ['Action', 'Sci-Fi', 'Drama', 'Comedy', 'Thriller', 'Romance', 'Horror', 'Adventure'],
    index: true  // For filtering
  },
  
  // Pricing & ratings
  price: {
    type: Number,
    required: true,
    min: 0,
    description: "Ticket price in INR"
  },
  
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
    description: "Movie rating (0-5 stars)"
  },
  
  // Details
  duration: {
    type: String,
    required: true,
    description: "Movie duration (e.g., '2h 46m')"
  },
  
  director: {
    type: String,
    required: true,
    description: "Director name"
  },
  
  cast: {
    type: [String],
    required: true,
    description: "Array of actor names",
    minItems: 1
  },
  
  description: {
    type: String,
    required: true,
    maxlength: 1000,
    description: "Full movie plot description"
  },
  
  // Media
  image: {
    type: String,
    required: true,
    description: "Poster image URL"
  },
  
  trailer: {
    type: String,
    required: true,
    description: "YouTube trailer embed URL"
  },
  
  // UI
  hero: {
    type: Boolean,
    default: false,
    description: "Featured on hero slider"
  }
},
{
  timestamps: true,  // Auto add createdAt, updatedAt
  collection: 'movies'
});

// Create indexes for performance
movieSchema.index({ title: 'text', description: 'text' });  // Full-text search
movieSchema.index({ genre: 1, rating: -1 });  // Compound index
movieSchema.index({ hero: 1 });
```

---

#### Theaters Collection Schema

```javascript
const theaterSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    description: "Unique theater identifier"
  },
  
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 200,
    index: true
  },
  
  location: {
    type: String,
    required: true,
    enum: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad'],
    index: true,  // For location-based queries
    description: "City where theater is located"
  },
  
  features: {
    type: [String],
    required: true,
    description: "Array of features (IMAX, Dolby Atmos, etc.)"
  },
  
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
    description: "Theater rating"
  },
  
  image: {
    type: String,
    required: true,
    description: "Theater image URL"
  },
  
  showtimes: {
    type: [String],
    required: true,
    description: "Array of available showtimes",
    minItems: 1
  },
  
  // Geolocation (optional, for distance calculation)
  lat: {
    type: Number,
    description: "Latitude coordinate"
  },
  
  lon: {
    type: Number,
    description: "Longitude coordinate"
  },
  
  // Capacity
  totalSeats: {
    type: Number,
    default: 350,
    min: 100,
    max: 1000,
    description: "Total theater capacity"
  },
  
  // Admin metadata
  managedBy: {
    type: String,
    description: "Manager/Admin email"
  }
},
{
  timestamps: true,
  collection: 'theaters'
});

theaterSchema.index({ location: 1, rating: -1 });  // Compound index
```

---

#### Bookings Collection Schema

```javascript
const bookingSchema = new mongoose.Schema({
  // User info
  userEmail: {
    type: String,
    required: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,  // Email regex
    index: true  // For user queries
  },
  
  // Booking details
  title: {
    type: String,
    required: true,
    description: "Movie title (denormalized for quick access)"
  },
  
  theater: {
    type: String,
    required: true,
    index: true,
    description: "Theater name"
  },
  
  time: {
    type: String,
    required: true,
    description: "Showtime (e.g., '08:30 AM')"
  },
  
  date: {
    type: String,
    required: true,
    description: "Booking date (e.g., '15 April 2025')"
  },
  
  // Seats (core data)
  seats: {
    type: [String],
    required: true,
    minItems: 1,
    maxItems: 9,
    description: "Array of selected seat IDs"
  },
  
  // Payment details
  total: {
    type: Number,
    required: true,
    min: 1,
    description: "Total amount in INR"
  },
  
  addons: {
    type: [String],
    default: [],
    description: "Optional items (Popcorn, Drinks, etc.)"
  },
  
  parking: {
    type: String,
    enum: ['None', 'Standard', 'Premium', 'VIP'],
    default: 'None',
    description: "Parking option selected"
  },
  
  paymentMode: {
    type: String,
    required: true,
    enum: ['UPI', 'Card', 'Banking', 'Cash'],
    description: "Payment method used"
  },
  
  // Tracking
  bookedOn: {
    type: Date,
    default: Date.now,
    index: true  // For sorting by date
  },
  
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'expired'],
    default: 'confirmed'
  },
  
  // Reference
  ticketId: {
    type: String,
    unique: true,
    description: "Generated ticket identifier"
  }
},
{
  timestamps: true,
  collection: 'bookings'
});

// Compound indexes for efficient queries
bookingSchema.index({ userEmail: 1, bookedOn: -1 });  // User's bookings
bookingSchema.index({ theater: 1, time: 1, date: 1 });  // Theater slots
bookingSchema.index({ status: 1, bookedOn: -1 });  // Status queries
```

---

## Appendix C1: Advanced Installation Guide

### Prerequisites Detailed

**System Requirements**:
```
OS: Windows 10+, macOS 10.14+, Linux (Ubuntu 18.04+)
RAM: Minimum 2GB, Recommended 4GB+
Disk Space: 500MB for project + dependencies
Node.js: v14.17.0 or higher
npm: v6.13.0 or higher (usually comes with Node.js)
```

**Verify Installation**:
```bash
# Check Node.js version
node --version
# Output: v16.13.0 (or higher)

# Check npm version
npm --version
# Output: 8.1.0 (or higher)

# Check MongoDB (if local)
mongod --version
# Output: db version v4.4.9 (or higher)
```

---

### Step-by-Step Detailed Setup

#### Step 1: Create Project Directory

```bash
# Create folder structure
mkdir -p cineflow
cd cineflow

# Create subdirectories
mkdir -p public/images
mkdir -p public/css
mkdir -p src
mkdir -p .github/workflows
```

#### Step 2: Initialize Node.js Project

```bash
# Generate package.json
npm init -y

# Output will be:
# About to write to /path/to/cineflow/package.json
# {
#   "name": "cineflow",
#   "version": "1.0.0",
#   "description": "Movie booking app",
#   ...
# }
```

#### Step 3: Install Dependencies

```bash
# Install core dependencies
npm install express mongoose cors dotenv

# Install development dependencies
npm install --save-dev nodemon

# Verify installations
npm list

# Output shows dependency tree:
# cineflow@1.0.0
# ├── cors@2.8.5
# ├── dotenv@16.0.0
# ├── express@4.18.2
# └── mongoose@7.0.0
```

#### Step 4: Configure Environment

```bash
# Create .env file
# On Windows (PowerShell)
New-Item -Path .env -ItemType File

# On macOS/Linux
touch .env

# Edit .env content
cat > .env << EOF
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://127.0.0.1:27017/cineflow
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cineflow?retryWrites=true&w=majority

# API Configuration
API_TIMEOUT=30000
MAX_CONNECTIONS=100
EOF
```

#### Step 5: MongoDB Setup

**Option A: Local MongoDB Setup**

```bash
# Windows - Install MongoDB Community
# Download from: https://www.mongodb.com/try/download/community
# Run installer and follow setup wizard

# Verify installation
mongod --version

# Start MongoDB service
# Windows (if installed as service):
net start MongoDB

# macOS (with Homebrew)
brew services start mongodb-community

# Linux (Ubuntu)
sudo systemctl start mongod

# Test connection
mongo --version
```

**Option B: MongoDB Atlas (Cloud)**

```
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create new cluster (M0 - Free tier)
4. Get connection string
5. Update .env:
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cineflow
```

#### Step 6: Create Server File

```javascript
// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
const URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cineflow';
mongoose.connect(URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('✓ MongoDB connected'))
.catch(err => {
  console.error('✗ MongoDB connection error:', err.message);
  process.exit(1);
});

// Define schemas and models here
// Define routes here

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message,
    status: err.status || 500
  });
});

// Start server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`✓ Server running on http://localhost:${port}`);
});
```

#### Step 7: Update package.json Scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "build": "echo 'No build process'",
    "deploy": "echo 'Deploy to production'"
  }
}
```

#### Step 8: Initialize Git Repository

```bash
# Initialize git
git init

# Create .gitignore
cat > .gitignore << EOF
node_modules/
.env
.env.local
.env.*.local
dist/
build/
.DS_Store
*.log
.vscode/
.idea/
EOF

# Initial commit
git add .
git commit -m "Initial CineFlow setup"
```

#### Step 9: Verify Full Setup

```bash
# Start development server
npm run dev

# Expected output:
# > nodemon server.js
# [nodemon] 2.0.20
# [nodemon] to restart at any time, type `rs`
# [nodemon] watching path(s): *.js
# ✓ MongoDB connected
# ✓ Server running on http://localhost:4000

# Test API endpoint
curl http://localhost:4000/api/movies

# Expected response:
# []
```

---

## Appendix G1: Smart Seat Selection Deep Dive

### Algorithm Detailed Explanation

#### Input Parameters

```javascript
// Available seats from theater
const allAvailableSeats = [
  { seatId: 'A1', type: 'standard' },
  { seatId: 'A2', type: 'standard' },
  // ... more seats
  { seatId: 'P1', type: 'premium' },
  { seatId: 'P2', type: 'premium' },
  // ... etc
];

// User request
const seatsNeeded = 5;

// Row preferences
const rowWeights = {
  'P': 1,      // Premium - Best (1 = highest priority)
  'A': 2,      // Standard - Better
  'B': 2,
  'C': 1,      // Good view
  'D': 1,
  'E': 0,      // Average
  'F': 0,      // Average
  'G': 1,      // Good view
  'H': 1,
  'I': 2,      // Standard - Better
  'J': 2,
  'K': 3       // Couple lounge - Lowest (3 = lowest priority)
};
```

#### Scoring Logic

```javascript
// For each potential seat block:
function calculateScore(seatBlock, rowLabel, seatsCount) {
  // 1. Contiguity check (must be consecutive)
  const isContiguous = seatBlock.every((seat, i, arr) => {
    if (i === 0) return true;
    const prevNum = parseInt(arr[i-1].seatId.slice(1));
    const currNum = parseInt(seat.seatId.slice(1));
    return currNum === prevNum + 1;
  });
  
  if (!isContiguous) return null;  // Skip non-contiguous blocks
  
  // 2. Calculate center alignment
  const seatNumbers = seatBlock.map(s => parseInt(s.seatId.slice(1)));
  const avgSeatNumber = seatNumbers.reduce((a, b) => a + b) / seatsCount;
  const centerSeat = 8;  // Theater width is 16, center is 8
  const distanceFromCenter = Math.abs(avgSeatNumber - centerSeat);
  
  // 3. Final score (lower is better)
  const rowWeight = rowWeights[rowLabel];
  const score = (rowWeight * 10) + distanceFromCenter;
  
  return {
    score: score,
    rowWeight: rowWeight,
    centerDistance: distanceFromCenter,
    seats: seatBlock
  };
}
```

#### Selection Process

```javascript
function smartSelectSeats(allAvailable, count) {
  const rows = ['P', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
  let bestSelection = null;

  // Iterate through rows in preference order
  for (const rowLabel of rows) {
    // Get all seats in this row
    const rowSeats = allAvailable
      .filter(s => s.seatId.startsWith(rowLabel))
      .sort((a, b) => {
        const numA = parseInt(a.seatId.slice(1));
        const numB = parseInt(b.seatId.slice(1));
        return numA - numB;
      });

    if (rowSeats.length < count) continue;  // Not enough seats in this row

    // Try every possible contiguous block
    for (let i = 0; i <= rowSeats.length - count; i++) {
      const block = rowSeats.slice(i, i + count);
      const score = calculateScore(block, rowLabel, count);
      
      if (score && (!bestSelection || score.score < bestSelection.score)) {
        bestSelection = score;
      }
    }
  }

  // Return best block or fallback
  return bestSelection ? bestSelection.seats : allAvailable.slice(0, count);
}
```

#### Example Execution

```javascript
// User selects 3 seats
const available = [
  'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8',  // Row A (all available)
  'P1', 'P2', 'P3', 'P4',                           // Row P (4 available)
  // ... more rows
];

// Algorithm evaluates:
// Block P1-P2-P3: score = (1*10) + |2-8| = 16
// Block A4-A5-A6: score = (2*10) + |5-8| = 23

// Result: Selects P1, P2, P3 (best score = 16)
```

---

## Appendix H1: Extended Troubleshooting Matrix

### Common Issues & Solutions

| Issue | Cause | Solution | Prevention |
|-------|-------|----------|-----------|
| **MongoDB Connection Fails** | Service not running | Start MongoDB service | Add startup script to .env |
| **CORS Errors** | Headers mismatch | Check app.use(cors()) | Whitelist origins in prod |
| **Seats Not Rendering** | DOM selector failure | Check HTML IDs | Add ID validation |
| **Bookings Fire Success** | Race condition | Implement locks | Add optimistic locking |
| **Images Not Loading** | Broken URLs | Test URLs directly | Use CDN with fallbacks |
| **Geolocation Timeout** | Slow GPS | User denies permission | Implement network fallback |
| **Port Already in Use** | Another process using port | Kill process or change port | Use pm2 for management |
| **Out of Memory** | Large dataset queries | Add pagination | Implement query limits |

---

### Extended Troubleshooting Scenarios

#### Scenario: Bookings API Returns 500 Error

```javascript
// Problem: Database query fails
// Error: MongooseError: Operation timeout

// Investigation:
// 1. Check MongoDB logs
tail -f /var/log/mongodb/mongod.log

// 2. Test connection directly
mongo mongodb://127.0.0.1:27017/cineflow

// 3. Check network connectivity
ping mongodb-server

// Solution:
// - Increase timeout: useServerSelectionTimeout(10000)
// - Add indexes to slow queries
// - Implement connection pooling
// - Scale MongoDB (add more nodes)
```

---

#### Scenario: Frontend Seat Selection UI Freezes

```javascript
// Problem: Large theater with 500+ seats causes lag

// Root cause: Too many DOM elements and event listeners

// Solution 1: Virtual scrolling
function renderSeatsVirtually(allSeats, visibleRange) {
  // Only render visible seats
  const visibleSeats = allSeats.slice(visibleRange.start, visibleRange.end);
  return renderSeats(visibleSeats);
}

// Solution 2: Event delegation
document.getElementById('seat-container').addEventListener('click', (e) => {
  if (e.target.classList.contains('seat')) {
    toggleSeat(e.target);
  }
});

// Solution 3: Web Worker for calculations
const worker = new Worker('seat-calculator.js');
worker.postMessage({ action: 'calculateBestSeats', seats: allSeats });
worker.onmessage = (e) => {
  console.log('Best seats:', e.data);
};
```

---

## Appendix I1: Security Implementation Guide

### Authentication & Authorization Pattern

```javascript
// JWT-based authentication (future enhancement)
const jwt = require('jsonwebtoken');

// User login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Verify credentials (hash password with bcrypt)
  const user = await User.findOne({ email });
  if (!user || !user.verifyPassword(password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Generate token
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  res.json({ token });
});

// Middleware to verify token
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Protected booking endpoint
app.post('/api/bookings', verifyToken, async (req, res) => {
  req.body.userEmail = req.user.email;  // Use authenticated user
  // ... proceed with booking
});
```

### Input Validation & Sanitization

```javascript
// Sanitize user inputs
const sanitize = (input) => {
  return input
    .trim()
    .replace(/[<>\"']/g, '')  // Remove HTML chars
    .substring(0, 100);  // Limit length
};

// Email validation
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Booking data validation
function validateBookingData(booking) {
  const errors = {};
  
  if (!validateEmail(booking.userEmail)) {
    errors.userEmail = 'Invalid email format';
  }
  
  if (!booking.seats || booking.seats.length === 0 || booking.seats.length > 9) {
    errors.seats = 'Seats must be between 1 and 9';
  }
  
  if (booking.total <= 0) {
    errors.total = 'Total must be greater than 0';
  }
  
  return Object.keys(errors).length === 0 ? null : errors;
}
```

---

## Appendix J1: Performance Benchmarks & Optimization

### Performance Metrics

```javascript
// Track API response times
app.use((req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`${req.method} ${req.path} - ${duration}ms`);
    
    // Alert if slow
    if (duration > 500) {
      console.warn('⚠ Slow request:', req.path);
    }
  });
  
  next();
});

// Target metrics
// GET /api/movies: < 100ms
// POST /api/bookings: < 200ms
// GET /api/bookings: < 150ms
```

### Caching Strategy

```javascript
// Implement Redis caching
const redis = require('redis');
const client = redis.createClient();

app.get('/api/movies', async (req, res) => {
  const cacheKey = `movies:${req.query.genre || 'all'}`;
  
  // Check cache
  client.get(cacheKey, async (err, cached) => {
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    // Query database
    const movies = await Movie.find(req.query);
    
    // Store in cache for 1 hour
    client.setex(cacheKey, 3600, JSON.stringify(movies));
    
    res.json(movies);
  });
});
```

---

## Appendix K1: Deployment Checklist

### Pre-Deployment

- [ ] All environment variables configured in `.env.production`
- [ ] Database indexes created for performance
- [ ] SSL/TLS certificates acquired
- [ ] Rate limiting configured
- [ ] Backup strategy implemented
- [ ] Monitoring and logging setup
- [ ] Error tracking (Sentry/Rollbar) configured
- [ ] Performance profiling completed
- [ ] Security audit passed
- [ ] Load testing completed

### Deployment Steps

```bash
# 1. Build and test
npm run build
npm run test

# 2. Create production environment
NODE_ENV=production

# 3. Start with PM2 (process manager)
npm install -g pm2
pm2 start server.js --name cineflow
pm2 save
pm2 startup

# 4. Setup reverse proxy (Nginx)
# Configure port 3000 to forward to 4000
# Enable gzip compression
# Add SSL certificates

# 5. Monitor and log
pm2 logs
pm2 monit
```

---

## Appendix L1: Quick Reference Commands

```bash
# Development
npm install          # Install dependencies
npm run dev         # Start with hot reload
npm start           # Start production

# Database
mongo               # Connect to MongoDB
db.movies.find()    # View all movies
db.bookings.find()  # View all bookings
db.dropDatabase()   # Clear database

# Testing
npm test            # Run tests
npm run test:watch  # Watch mode

# Deployment
git push origin main
npm run build
npm run deploy
```

---

**End of Extended Appendices**
