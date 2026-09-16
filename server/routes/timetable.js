import express from 'express';
import { Timetable } from '../models/Timetable.js';

const router = express.Router();

// GET all timetable entries
router.get('/', async (req, res) => {
  try {
    const { class: classId, teacher, day, academicYear } = req.query;
    const filter = {};
    if (classId) filter.class = classId;
    if (teacher) filter.teacher = teacher;
    if (day) filter.day = day;
    if (academicYear) filter.academicYear = academicYear;

    const timetable = await Timetable.find(filter)
      .populate('class', 'name section')
      .populate('subject', 'name code')
      .populate('teacher', 'name email')
      .sort({ day: 1, period: 1 });
    res.json({ count: timetable.length, timetable });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch timetable', details: err.message });
  }
});

// GET timetable by ID
router.get('/:id', async (req, res) => {
  try {
    const entry = await Timetable.findById(req.params.id)
      .populate('class')
      .populate('subject')
      .populate('teacher', 'name email');
    if (!entry) return res.status(404).json({ error: 'Timetable entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch timetable entry', details: err.message });
  }
});

// POST create timetable entry
router.post('/', async (req, res) => {
  try {
    const entry = new Timetable(req.body);
    await entry.save();
    res.status(201).json({ message: 'Timetable entry created successfully', timetable: entry });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'This time slot is already occupied for this class' });
    }
    res.status(500).json({ error: 'Failed to create timetable entry', details: err.message });
  }
});

// PUT update timetable entry
router.put('/:id', async (req, res) => {
  try {
    const entry = await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('class', 'name section')
      .populate('subject', 'name code')
      .populate('teacher', 'name email');
    if (!entry) return res.status(404).json({ error: 'Timetable entry not found' });
    res.json({ message: 'Timetable entry updated successfully', timetable: entry });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update timetable entry', details: err.message });
  }
});

// DELETE timetable entry
router.delete('/:id', async (req, res) => {
  try {
    const entry = await Timetable.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Timetable entry not found' });
    res.json({ message: 'Timetable entry deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete timetable entry', details: err.message });
  }
});

export default router;
