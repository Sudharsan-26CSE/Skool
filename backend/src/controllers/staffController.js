const asyncHandler = require('express-async-handler');
const Staff = require('../models/Staff');
const User = require('../models/User');

exports.getStaff = asyncHandler(async (req, res) => {
  const { role, department, search } = req.query;
  let staffList = await Staff.find().populate('user', 'name email phone role').sort({ createdAt: -1 });
  if (role) staffList = staffList.filter(s => s.user?.role === role);
  if (department) staffList = staffList.filter(s => s.department?.toLowerCase().includes(department.toLowerCase()));
  if (search) staffList = staffList.filter(s => s.user?.name?.toLowerCase().includes(search.toLowerCase()) || s.employeeId?.includes(search));
  res.json({ success: true, count: staffList.length, staff: staffList });
});

exports.getStaffMember = asyncHandler(async (req, res) => {
  const member = await Staff.findById(req.params.id).populate('user', 'name email phone role');
  if (!member) { res.status(404); throw new Error('Staff member not found'); }
  res.json({ success: true, staff: member });
});

exports.createStaff = asyncHandler(async (req, res) => {
  const { name, email, password, role, department, designation, qualification, experience, salary } = req.body;
  const exists = await User.findOne({ email });
  if (exists) { res.status(400); throw new Error('Email already in use'); }
  const user = await User.create({ name, email, password: password || 'Skool@123', role: role || 'staff' });
  const staff = await Staff.create({ user: user._id, department, designation, qualification, experience, salary });
  res.status(201).json({ success: true, staff: await staff.populate('user', 'name email role') });
});

exports.updateStaff = asyncHandler(async (req, res) => {
  const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('user', 'name email phone role');
  if (!staff) { res.status(404); throw new Error('Staff not found'); }
  res.json({ success: true, staff });
});

exports.deleteStaff = asyncHandler(async (req, res) => {
  const staff = await Staff.findById(req.params.id);
  if (!staff) { res.status(404); throw new Error('Staff not found'); }
  await User.findByIdAndDelete(staff.user);
  await staff.deleteOne();
  res.json({ success: true, message: 'Staff deleted successfully' });
});
