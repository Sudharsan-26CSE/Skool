import express from 'express';
import { Staff } from '../models/Staff.js';

const router = express.Router();

// GET all staff
router.get('/', async (req, res) => {
  try {
    const { department, designation, isActive } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (designation) filter.designation = designation;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const staff = await Staff.find(filter)
      .populate('user', '-password')
      .sort({ createdAt: -1 });
    res.json({ count: staff.length, staff });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch staff', details: err.message });
  }
});

// GET staff by ID
router.get('/:id', async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id).populate('user', '-password');
    if (!staff) return res.status(404).json({ error: 'Staff not found' });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch staff', details: err.message });
  }
});

// POST create staff
router.post('/', async (req, res) => {
  try {
    const staff = new Staff(req.body);
    await staff.save();
    const populated = await staff.populate('user', '-password');
    res.status(201).json({ message: 'Staff created successfully', staff: populated });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Employee ID already exists' });
    }
    res.status(500).json({ error: 'Failed to create staff', details: err.message });
  }
});

// PUT update staff
router.put('/:id', async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('user', '-password');
    if (!staff) return res.status(404).json({ error: 'Staff not found' });
    res.json({ message: 'Staff updated successfully', staff });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update staff', details: err.message });
  }
});

// DELETE staff
router.delete('/:id', async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ error: 'Staff not found' });
    res.json({ message: 'Staff deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete staff', details: err.message });
  }
});

export default router;
