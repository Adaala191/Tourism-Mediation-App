const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required: name, email, password, role' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    const savedUser = await user.save();

    // Generate JWT token
    const token = generateToken(savedUser);

    res.status(201).json({ message: 'User registered successfully', user: savedUser, token });
  } catch (error) {
    console.error('Error in register:', error.message);
    res.status(500).json({ message: 'Error registering user', error: 'Server error' });
  }
};

// Login a user
const login = async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }

    // Check the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json({ message: 'Login successful', user, token });
  } catch (error) {
    console.error('Error in login:', error.message);
    res.status(500).json({ message: 'Error logging in', error: 'Server error' });
  }
};

module.exports = {
  register,
  login,
};
