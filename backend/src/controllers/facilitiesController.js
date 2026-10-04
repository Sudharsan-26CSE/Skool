const asyncHandler = require('express-async-handler');
const Transport = require('../models/Transport');
const Hostel = require('../models/Hostel');
const Leave = require('../models/Leave');
const OnlineClass = require('../models/OnlineClass');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const Timetable = require('../models/Timetable');

// ── TRANSPORT ────────────────────────────────────────────────────
exports.getTransports = asyncHandler(async (req, res) => {
  const list = await Transport.find().populate('students', 'admissionNo user').sort({ vehicleNo: 1 });
  res.json({ success: true, count: list.length, transports: list });
});
exports.createTransport = asyncHandler(async (req, res) => {
  const t = await Transport.create(req.body);
  res.status(201).json({ success: true, transport: t });
});
exports.updateTransport = asyncHandler(async (req, res) => {
  const t = await Transport.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!t) { res.status(404); throw new Error('Transport not found'); }
  res.json({ success: true, transport: t });
});
exports.deleteTransport = asyncHandler(async (req, res) => {
  await Transport.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Deleted' });
});

// ── HOSTEL ───────────────────────────────────────────────────────
exports.getHostels = asyncHandler(async (req, res) => {
  const { available, hostelName } = req.query;
  let query = {};
  if (available   !== undefined) query.isAvailable = available === 'true';
  if (hostelName) query.hostelName = { $regex: hostelName, $options: 'i' };
  const rooms = await Hostel.find(query).populate('occupants', 'admissionNo user');
  res.json({ success: true, count: rooms.length, hostels: rooms });
});
exports.createHostel = asyncHandler(async (req, res) => {
  const h = await Hostel.create(req.body);
  res.status(201).json({ success: true, hostel: h });
});
exports.updateHostel = asyncHandler(async (req, res) => {
  const h = await Hostel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!h) { res.status(404); throw new Error('Hostel room not found'); }
  res.json({ success: true, hostel: h });
});
exports.allocateRoom = asyncHandler(async (req, res) => {
  const { studentId } = req.body;
  const room = await Hostel.findById(req.params.id);
  if (!room) { res.status(404); throw new Error('Room not found'); }
  if (room.occupants.length >= room.capacity) { res.status(400); throw new Error('Room is full'); }
  if (!room.occupants.includes(studentId)) room.occupants.push(studentId);
  room.isAvailable = room.occupants.length < room.capacity;
  await room.save();
  res.json({ success: true, message: 'Student allocated to room' });
});

// ── LEAVE REQUESTS ───────────────────────────────────────────────
exports.getLeaves = asyncHandler(async (req, res) => {
  const { status, applicant } = req.query;
  let query = {};
  if (status)    query.status    = status;
  if (applicant) query.applicant = applicant;
  const leaves = await Leave.find(query).populate('applicant', 'name role email').sort({ createdAt: -1 });
  res.json({ success: true, count: leaves.length, leaves });
});
exports.createLeave = asyncHandler(async (req, res) => {
  const leave = await Leave.create({ ...req.body, applicant: req.user._id });
  res.status(201).json({ success: true, leave });
});
exports.updateLeaveStatus = asyncHandler(async (req, res) => {
  const { status, remarks } = req.body;
  const leave = await Leave.findByIdAndUpdate(
    req.params.id,
    { status, remarks, approvedBy: req.user._id },
    { new: true }
  );
  if (!leave) { res.status(404); throw new Error('Leave not found'); }
  res.json({ success: true, leave });
});

// ── ONLINE CLASSES ───────────────────────────────────────────────
exports.getOnlineClasses = asyncHandler(async (req, res) => {
  const { status, teacher, classId } = req.query;
  let query = {};
  if (status)  query.status  = status;
  if (teacher) query.teacher = teacher;
  if (classId) query.class   = classId;
  const classes = await OnlineClass.find(query)
    .populate('teacher', 'user')
    .populate('class', 'name section')
    .populate('subject', 'name')
    .sort({ scheduledAt: -1 });
  res.json({ success: true, count: classes.length, classes });
});
exports.createOnlineClass = asyncHandler(async (req, res) => {
  const oc = await OnlineClass.create(req.body);
  res.status(201).json({ success: true, class: oc });
});
exports.updateOnlineClass = asyncHandler(async (req, res) => {
  const oc = await OnlineClass.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!oc) { res.status(404); throw new Error('Online class not found'); }
  res.json({ success: true, class: oc });
});
exports.deleteOnlineClass = asyncHandler(async (req, res) => {
  await OnlineClass.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Deleted' });
});

// ── CLASSES ──────────────────────────────────────────────────────
exports.getClasses = asyncHandler(async (req, res) => {
  const classes = await Class.find().populate('classTeacher', 'user').populate('subjects', 'name code');
  res.json({ success: true, count: classes.length, classes });
});
exports.createClass = asyncHandler(async (req, res) => {
  const cls = await Class.create(req.body);
  res.status(201).json({ success: true, class: cls });
});
exports.updateClass = asyncHandler(async (req, res) => {
  const cls = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!cls) { res.status(404); throw new Error('Class not found'); }
  res.json({ success: true, class: cls });
});
exports.deleteClass = asyncHandler(async (req, res) => {
  await Class.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Deleted' });
});

// ── SUBJECTS ─────────────────────────────────────────────────────
exports.getSubjects = asyncHandler(async (req, res) => {
  const subjects = await Subject.find().populate('teacher', 'user');
  res.json({ success: true, count: subjects.length, subjects });
});
exports.createSubject = asyncHandler(async (req, res) => {
  const sub = await Subject.create(req.body);
  res.status(201).json({ success: true, subject: sub });
});
exports.updateSubject = asyncHandler(async (req, res) => {
  const sub = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!sub) { res.status(404); throw new Error('Subject not found'); }
  res.json({ success: true, subject: sub });
});
exports.deleteSubject = asyncHandler(async (req, res) => {
  await Subject.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Deleted' });
});

// ── TIMETABLE ────────────────────────────────────────────────────
exports.getTimetable = asyncHandler(async (req, res) => {
  const { classId, day } = req.query;
  let query = {};
  if (classId) query.class = classId;
  if (day)     query.day   = day;
  const timetable = await Timetable.find(query)
    .populate('subject', 'name code')
    .populate('teacher', 'user')
    .sort({ day: 1, startTime: 1 });
  res.json({ success: true, timetable });
});
exports.createTimetableSlot = asyncHandler(async (req, res) => {
  const slot = await Timetable.create(req.body);
  res.status(201).json({ success: true, slot });
});
exports.updateTimetableSlot = asyncHandler(async (req, res) => {
  const slot = await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!slot) { res.status(404); throw new Error('Slot not found'); }
  res.json({ success: true, slot });
});
exports.deleteTimetableSlot = asyncHandler(async (req, res) => {
  await Timetable.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Slot deleted' });
});
