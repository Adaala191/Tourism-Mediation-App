const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// Import middleware
const { authenticateToken, restrictTo } = require('./middleware/authMiddleware');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Check if MONGO_URI is provided
if (!process.env.MONGO_URI) {
  console.error('Missing MONGO_URI in environment variables');
  process.exit(1);
}

// Middleware for parsing JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/users', authenticateToken, restrictTo('Admin'), userRoutes);       // Admin only
app.use('/api/services', authenticateToken, serviceRoutes);                      // Logged-in users
app.use('/api/bookings', authenticateToken, restrictTo('Client'), bookingRoutes); // Clients only

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An internal server error occurred.' });
});

// 404 Not Found handling middleware
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
