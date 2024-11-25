const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import models
const User = require('./models/user');
const Service = require('./models/service');
const Booking = require('./models/booking');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err.message);
});

// Test the models
const testModels = async () => {
  try {
    // Create a test user
    const user = new User({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'hashedpassword',
      role: 'Client',
    });
    const savedUser = await user.save();
    console.log('User saved:', savedUser);

    // Create a test service
    const service = new Service({
      name: 'Luxury Hotel',
      type: 'Hotel',
      description: 'A five-star hotel in the city center',
      price: 300,
      location: 'New York',
      providerId: savedUser._id,
    });
    const savedService = await service.save();
    console.log('Service saved:', savedService);

    // Create a test booking
    const booking = new Booking({
      clientId: savedUser._id,
      serviceId: savedService._id,
      date: new Date(),
    });
    const savedBooking = await booking.save();
    console.log('Booking saved:', savedBooking);

    // Exit the script
    mongoose.disconnect();
  } catch (error) {
    console.error('Error testing models:', error.message);
    mongoose.disconnect();
  }
};

testModels();
