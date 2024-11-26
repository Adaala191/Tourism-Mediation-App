const jwt = require('jsonwebtoken');

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Extract Bearer token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access Denied: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token and attach decoded payload to req.user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token', error: error.message });
  }
};

// Middleware to restrict access based on roles
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Access Denied: User not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access forbidden: Insufficient permissions' });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  restrictTo,
};
