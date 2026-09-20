const asyncHandler = require('express-async-handler');
const Attendance = require('../models/Attendance');

exports.getAttendance = asyncHandler(async (req, res) => {
  const { studentId, classId, date, startDate, endDate } = req.query;
  let query = {};
  if (studentId) query.student = studentId;
  if (classId)   query.class   = classId;
  if (date)      query.date    = new Date(date);
  if (startDate && endDate) query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  const records = await Attendance.find(query)
    .populate('student', 'admissionNo user')
    .populate('class', 'name section')
    .sort({ date: -1 });
  res.json({ success: true, count: records.length, attendance: records });
});

// Mark attendance for a list of students
exports.markAttendance = asyncHandler(async (req, res) => {
  const { records, date, classId } = req.body;
  // records = [{ studentId, status, remarks }]
  const ops = records.map(r => ({
    updateOne: {
      filter: { student: r.studentId, date: new Date(date), class: classId },
      update: { $set: { status: r.status, remarks: r.remarks, markedBy: req.user._id } },
      upsert: true,
    }
  }));
  await Attendance.bulkWrite(ops);
  res.json({ success: true, message: `Attendance marked for ${records.length} student(s)` });
});

// Get attendance summary stats
exports.getAttendanceSummary = asyncHandler(async (req, res) => {
  const { studentId, month, year } = req.query;
  const start = new Date(year, month - 1, 1);
  const end   = new Date(year, month, 0);
  const records = await Attendance.find({ student: studentId, date: { $gte: start, $lte: end } });
  const summary = {
    total:   records.length,
    present: records.filter(r => r.status === 'present').length,
    absent:  records.filter(r => r.status === 'absent').length,
    late:    records.filter(r => r.status === 'late').length,
    excused: records.filter(r => r.status === 'excused').length,
  };
  summary.percentage = summary.total ? ((summary.present / summary.total) * 100).toFixed(1) : 0;
  res.json({ success: true, summary });
});
