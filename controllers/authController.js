const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Helper function to generate a JWT token
const generateToken = (user) => {
  const payload = {
    id: user._id,
    role: user.role,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Register a new user
const register = async (req, res) => {
  console.log('Request Body:', req.body); // Log the request body for debugging
  try {
    const { name, email, password, role } = req.body;

    // Check for missing fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required: name, email, password, role' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password, role });
    const savedUser = await user.save();

    // Generate JWT token
    const token = generateToken(savedUser);

    res.status(201).json({ user: savedUser, token });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login a user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }

    // Check the password
    const isMatch = user.comparePassword(password);
    if (!isMatch) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

module.exports = {
  register,
  login,
};
