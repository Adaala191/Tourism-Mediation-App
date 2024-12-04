const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Client', 'Provider', 'Admin'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  this.password = crypto.createHmac('sha1', process.env.JWT_SECRET).update(this.password).digest('hex');
  next();
});

// Generate JWT
userSchema.methods.generateJWT = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' } // Token expires in 1 hour
  );
};

// Compare password
userSchema.methods.comparePassword = function (password) {
  const hashedPassword = crypto.createHmac('sha1', process.env.JWT_SECRET).update(password).digest('hex');
  return this.password === hashedPassword;
};

module.exports = mongoose.model('User', userSchema);
