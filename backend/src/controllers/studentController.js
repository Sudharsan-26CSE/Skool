const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const User = require('../models/User');

// @desc  Get all students
// @route GET /api/students
// @access Private (admin, teacher, staff)
exports.getStudents = asyncHandler(async (req, res) => {
  const { classId, isActive, search } = req.query;
  let query = {};
  if (classId) query.class = classId;
  if (isActive !== undefined) query.isActive = isActive === 'true';
  const students = await Student.find(query)
    .populate('user', 'name email phone')
    .populate('class', 'name section')
    .sort({ createdAt: -1 });
  const filtered = search
    ? students.filter(s => s.user?.name?.toLowerCase().includes(search.toLowerCase()) || s.admissionNo?.includes(search))
    : students;
  res.json({ success: true, count: filtered.length, students: filtered });
});

// @desc  Get single student
// @route GET /api/students/:id
// @access Private
exports.getStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id)
    .populate('user', 'name email phone')
    .populate('class', 'name section classTeacher');
  if (!student) { res.status(404); throw new Error('Student not found'); }
  res.json({ success: true, student });
});

// @desc  Create student (creates User + Student record)
// @route POST /api/students
// @access Private (admin, staff)
exports.createStudent = asyncHandler(async (req, res) => {
  const { name, email, password, className, parentName, parentPhone, parentEmail, dateOfBirth, gender, address, bloodGroup, classId } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) { res.status(400); throw new Error('Email already in use'); }
  const user = await User.create({ name, email, password: password || 'Skool@123', role: 'student' });
  const student = await Student.create({ user: user._id, class: classId, parentName, parentPhone, parentEmail, dateOfBirth, gender, address, bloodGroup });
  res.status(201).json({ success: true, student: await student.populate('user', 'name email') });
});

// @desc  Update student
// @route PUT /api/students/:id
// @access Private (admin, staff)
exports.updateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    .populate('user', 'name email phone').populate('class', 'name section');
  if (!student) { res.status(404); throw new Error('Student not found'); }
  res.json({ success: true, student });
});

// @desc  Delete student
// @route DELETE /api/students/:id
// @access Private (admin)
exports.deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) { res.status(404); throw new Error('Student not found'); }
  await User.findByIdAndDelete(student.user);
  await student.deleteOne();
  res.json({ success: true, message: 'Student deleted successfully' });
});

// @desc  Activate/Deactivate student
// @route PUT /api/students/:id/toggle-status
// @access Private (admin)
exports.toggleStatus = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) { res.status(404); throw new Error('Student not found'); }
  student.isActive = !student.isActive;
  await student.save();
  res.json({ success: true, isActive: student.isActive });
});
