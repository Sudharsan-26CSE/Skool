const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// @desc  Register user
// @route POST /api/auth/register
// @access Public
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) { res.status(400); throw new Error('Email already registered'); }
  const user = await User.create({ name, email, password, role: role || 'student' });
  res.status(201).json({
    success: true,
    token: generateToken(user._id),
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// @desc  Login user
// @route POST /api/auth/login
// @access Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) { res.status(400); throw new Error('Email and password are required'); }
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401); throw new Error('Invalid credentials');
  }
  if (!user.isActive) { res.status(403); throw new Error('Account is deactivated'); }
  res.json({
    success: true,
    token: generateToken(user._id),
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone },
  });
});

// @desc  Get logged-in user profile
// @route GET /api/auth/me
// @access Private
exports.getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

// @desc  Update profile
// @route PUT /api/auth/me
// @access Private
exports.updateMe = asyncHandler(async (req, res) => {
  const { name, phone, avatar } = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, { name, phone, avatar }, { new: true, runValidators: true }).select('-password');
  res.json({ success: true, user });
});

// @desc  Change password
// @route PUT /api/auth/change-password
// @access Private
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  if (!(await user.matchPassword(currentPassword))) {
    res.status(400); throw new Error('Current password is incorrect');
  }
  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password updated successfully' });
});
