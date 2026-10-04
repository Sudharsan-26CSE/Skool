require('../config/firebase-admin'); // Ensure initialized
const { getAuth } = require('firebase-admin/auth');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// ── Protect: verify Firebase JWT ──────────────────────────────────────────
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
  
  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    
    let user = await User.findOne({ email: decodedToken.email }).select('-password');
    
    if (!user) {
      // Auto-provision user in MongoDB on first request
      user = await User.create({
        name: decodedToken.name || decodedToken.email.split('@')[0],
        email: decodedToken.email,
        password: 'FIREBASE_AUTH_USER', // Handled by Firebase
        role: 'student'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

// ── Role Guard ───────────────────────────────────────────────────
exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    res.status(403);
    throw new Error(`Role '${req.user.role}' is not authorized for this action`);
  }
  next();
};
