import express from 'express';
import { Attendance } from '../models/Attendance.js';

const router = express.Router();

// GET attendance records
router.get('/', async (req, res) => {
  try {
    const { student, class: classId, date, status, from, to } = req.query;
    const filter = {};
    if (student) filter.student = student;
    if (classId) filter.class = classId;
    if (status) filter.status = status;
    if (date) {
      const d = new Date(date);
      filter.date = { $gte: new Date(d.setHours(0, 0, 0, 0)), $lte: new Date(d.setHours(23, 59, 59, 999)) };
    } else if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }

    const attendance = await Attendance.find(filter)
      .populate('student')
      .populate('class', 'name section')
      .populate('markedBy', 'name')
      .sort({ date: -1 });
    res.json({ count: attendance.length, attendance });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch attendance', details: err.message });
  }
});

// GET attendance by ID
router.get('/:id', async (req, res) => {
  try {
    const record = await Attendance.findById(req.params.id)
      .populate('student')
      .populate('class')
      .populate('markedBy', 'name');
    if (!record) return res.status(404).json({ error: 'Attendance record not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch attendance', details: err.message });
  }
});

// POST mark attendance (single)
router.post('/', async (req, res) => {
  try {
    const record = new Attendance(req.body);
    await record.save();
    res.status(201).json({ message: 'Attendance marked successfully', attendance: record });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Attendance already marked for this student on this date' });
    }
    res.status(500).json({ error: 'Failed to mark attendance', details: err.message });
  }
});

// POST mark attendance (bulk)
router.post('/bulk', async (req, res) => {
  try {
    const { records } = req.body;
    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: 'Provide an array of attendance records' });
    }
    const created = await Attendance.insertMany(records, { ordered: false }).catch(err => {
      // Return successfully inserted even if some duplicates
      return err.insertedDocs || [];
    });
    res.status(201).json({ message: 'Attendance marked', count: created.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark attendance', details: err.message });
  }
});

// PUT update attendance
router.put('/:id', async (req, res) => {
  try {
    const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('student')
      .populate('class', 'name section');
    if (!record) return res.status(404).json({ error: 'Attendance record not found' });
    res.json({ message: 'Attendance updated successfully', attendance: record });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update attendance', details: err.message });
  }
});

// DELETE attendance
router.delete('/:id', async (req, res) => {
  try {
    const record = await Attendance.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ error: 'Attendance record not found' });
    res.json({ message: 'Attendance record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete attendance', details: err.message });
  }
});

export default router;
