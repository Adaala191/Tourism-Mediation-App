const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Log MONGO_URI to verify it's being read correctly
console.log('MONGO_URI:', process.env.MONGO_URI);

// Import models
const User = require('./models/user');
const Service = require('./models/service');
const Booking = require('./models/booking');

// Connect to MongoDB using the MONGO_URI from .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit process on connection error
  });

// Test the models
const testModels = async () => {
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email: 'testuser@example.com' });
    if (!existingUser) {
      const user = new User({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'hashedpassword',
        role: 'Client',
      });
      const savedUser = await user.save();
      console.log('User saved:', savedUser);
    } else {
      console.log('User already exists:', existingUser);
    }

    // You can add more tests here for Service and Booking models if needed

  } catch (error) {
    console.error('Error testing models:', error.message);
  } finally {
    mongoose.disconnect(); // Disconnect from MongoDB after testing
  }
};

// Execute the test function
testModels();
