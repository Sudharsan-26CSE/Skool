import express from 'express';
import { Student } from '../models/Student.js';

const router = express.Router();

// GET all students
router.get('/', async (req, res) => {
  try {
    const { class: classId, section, feeStatus, isActive } = req.query;
    const filter = {};
    if (classId) filter.class = classId;
    if (section) filter.section = section;
    if (feeStatus) filter.feeStatus = feeStatus;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const students = await Student.find(filter)
      .populate('user', '-password')
      .populate('class')
      .sort({ createdAt: -1 });
    res.json({ count: students.length, students });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students', details: err.message });
  }
});

// GET student by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('user', '-password')
      .populate('class')
      .populate('transportRoute')
      .populate('hostelRoom');
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch student', details: err.message });
  }
});

// POST create student
router.post('/', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    const populated = await student.populate('user', '-password');
    res.status(201).json({ message: 'Student created successfully', student: populated });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Admission number already exists' });
    }
    res.status(500).json({ error: 'Failed to create student', details: err.message });
  }
});

// PUT update student
router.put('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('user', '-password')
      .populate('class');
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: 'Student updated successfully', student });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update student', details: err.message });
  }
});

// DELETE student
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete student', details: err.message });
  }
});

export default router;
