import express from 'express';
import { ClassManagement } from '../models/ClassManagement.js';

const router = express.Router();

// GET all classes
router.get('/', async (req, res) => {
  try {
    const { academicYear, isActive } = req.query;
    const filter = {};
    if (academicYear) filter.academicYear = academicYear;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const classes = await ClassManagement.find(filter)
      .populate('classTeacher', 'name email')
      .sort({ name: 1, section: 1 });
    res.json({ count: classes.length, classes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch classes', details: err.message });
  }
});

// GET class by ID
router.get('/:id', async (req, res) => {
  try {
    const classDoc = await ClassManagement.findById(req.params.id)
      .populate('classTeacher', 'name email');
    if (!classDoc) return res.status(404).json({ error: 'Class not found' });
    res.json(classDoc);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch class', details: err.message });
  }
});

// POST create class
router.post('/', async (req, res) => {
  try {
    const classDoc = new ClassManagement(req.body);
    await classDoc.save();
    res.status(201).json({ message: 'Class created successfully', class: classDoc });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'This class section already exists for the academic year' });
    }
    res.status(500).json({ error: 'Failed to create class', details: err.message });
  }
});

// PUT update class
router.put('/:id', async (req, res) => {
  try {
    const classDoc = await ClassManagement.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('classTeacher', 'name email');
    if (!classDoc) return res.status(404).json({ error: 'Class not found' });
    res.json({ message: 'Class updated successfully', class: classDoc });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update class', details: err.message });
  }
});

// DELETE class
router.delete('/:id', async (req, res) => {
  try {
    const classDoc = await ClassManagement.findByIdAndDelete(req.params.id);
    if (!classDoc) return res.status(404).json({ error: 'Class not found' });
    res.json({ message: 'Class deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete class', details: err.message });
  }
});

export default router;
