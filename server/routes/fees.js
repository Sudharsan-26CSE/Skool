import express from 'express';
import { FeeManagement } from '../models/FeeManagement.js';

const router = express.Router();

// GET all fee records
router.get('/', async (req, res) => {
  try {
    const { student, status, feeType, academicYear } = req.query;
    const filter = {};
    if (student) filter.student = student;
    if (status) filter.status = status;
    if (feeType) filter.feeType = feeType;
    if (academicYear) filter.academicYear = academicYear;

    const fees = await FeeManagement.find(filter)
      .populate({ path: 'student', populate: { path: 'user', select: 'name email' } })
      .sort({ dueDate: -1 });
    res.json({ count: fees.length, fees });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch fees', details: err.message });
  }
});

// GET fee by ID
router.get('/:id', async (req, res) => {
  try {
    const fee = await FeeManagement.findById(req.params.id)
      .populate({ path: 'student', populate: { path: 'user', select: 'name email' } });
    if (!fee) return res.status(404).json({ error: 'Fee record not found' });
    res.json(fee);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch fee', details: err.message });
  }
});

// POST create fee record
router.post('/', async (req, res) => {
  try {
    const fee = new FeeManagement(req.body);
    await fee.save();
    res.status(201).json({ message: 'Fee record created successfully', fee });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create fee record', details: err.message });
  }
});

// PUT update fee record
router.put('/:id', async (req, res) => {
  try {
    const fee = await FeeManagement.findById(req.params.id);
    if (!fee) return res.status(404).json({ error: 'Fee record not found' });
    Object.assign(fee, req.body);
    await fee.save(); // triggers pre-save for totalAmount
    res.json({ message: 'Fee record updated successfully', fee });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update fee record', details: err.message });
  }
});

// DELETE fee record
router.delete('/:id', async (req, res) => {
  try {
    const fee = await FeeManagement.findByIdAndDelete(req.params.id);
    if (!fee) return res.status(404).json({ error: 'Fee record not found' });
    res.json({ message: 'Fee record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete fee record', details: err.message });
  }
});

export default router;
