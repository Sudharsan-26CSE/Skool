import express from 'express';
import { Payroll } from '../models/Payroll.js';

const router = express.Router();

// GET all payroll records
router.get('/', async (req, res) => {
  try {
    const { staff, month, year, status } = req.query;
    const filter = {};
    if (staff) filter.staff = staff;
    if (month) filter.month = parseInt(month);
    if (year) filter.year = parseInt(year);
    if (status) filter.status = status;

    const payrolls = await Payroll.find(filter)
      .populate({ path: 'staff', populate: { path: 'user', select: 'name email' } })
      .sort({ year: -1, month: -1 });
    res.json({ count: payrolls.length, payrolls });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payroll records', details: err.message });
  }
});

// GET payroll by ID
router.get('/:id', async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id)
      .populate({ path: 'staff', populate: { path: 'user', select: 'name email' } });
    if (!payroll) return res.status(404).json({ error: 'Payroll record not found' });
    res.json(payroll);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payroll', details: err.message });
  }
});

// POST create payroll
router.post('/', async (req, res) => {
  try {
    const payroll = new Payroll(req.body);
    await payroll.save();
    res.status(201).json({ message: 'Payroll record created successfully', payroll });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Payroll already exists for this staff member for the given month/year' });
    }
    res.status(500).json({ error: 'Failed to create payroll record', details: err.message });
  }
});

// PUT update payroll
router.put('/:id', async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);
    if (!payroll) return res.status(404).json({ error: 'Payroll record not found' });
    Object.assign(payroll, req.body);
    await payroll.save(); // triggers pre-save for calculations
    res.json({ message: 'Payroll record updated successfully', payroll });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update payroll record', details: err.message });
  }
});

// DELETE payroll
router.delete('/:id', async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndDelete(req.params.id);
    if (!payroll) return res.status(404).json({ error: 'Payroll record not found' });
    res.json({ message: 'Payroll record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete payroll record', details: err.message });
  }
});

export default router;
