import express from 'express';
import { Report } from '../models/Report.js';

const router = express.Router();

// GET all reports
router.get('/', async (req, res) => {
  try {
    const { type, status } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;

    const reports = await Report.find(filter)
      .populate('generatedBy', 'name')
      .sort({ createdAt: -1 });
    res.json({ count: reports.length, reports });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports', details: err.message });
  }
});

// GET report by ID
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('generatedBy', 'name')
      .populate('filters.class', 'name section')
      .populate('filters.student')
      .populate('filters.staff');
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch report', details: err.message });
  }
});

// POST create/generate report
router.post('/', async (req, res) => {
  try {
    const report = new Report(req.body);
    await report.save();
    res.status(201).json({ message: 'Report generated successfully', report });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate report', details: err.message });
  }
});

// PUT update report
router.put('/:id', async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json({ message: 'Report updated successfully', report });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update report', details: err.message });
  }
});

// DELETE report
router.delete('/:id', async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json({ message: 'Report deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete report', details: err.message });
  }
});

export default router;
