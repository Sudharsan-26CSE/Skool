import express from 'express';
import { Transport } from '../models/Transport.js';

const router = express.Router();

// GET all transport routes
router.get('/', async (req, res) => {
  try {
    const { isActive } = req.query;
    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const routes = await Transport.find(filter)
      .populate('students')
      .sort({ routeName: 1 });
    res.json({ count: routes.length, routes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transport routes', details: err.message });
  }
});

// GET transport route by ID
router.get('/:id', async (req, res) => {
  try {
    const route = await Transport.findById(req.params.id).populate('students');
    if (!route) return res.status(404).json({ error: 'Transport route not found' });
    res.json(route);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transport route', details: err.message });
  }
});

// POST create transport route
router.post('/', async (req, res) => {
  try {
    const route = new Transport(req.body);
    await route.save();
    res.status(201).json({ message: 'Transport route created successfully', route });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Route number already exists' });
    }
    res.status(500).json({ error: 'Failed to create transport route', details: err.message });
  }
});

// PUT update transport route
router.put('/:id', async (req, res) => {
  try {
    const route = await Transport.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!route) return res.status(404).json({ error: 'Transport route not found' });
    res.json({ message: 'Transport route updated successfully', route });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update transport route', details: err.message });
  }
});

// DELETE transport route
router.delete('/:id', async (req, res) => {
  try {
    const route = await Transport.findByIdAndDelete(req.params.id);
    if (!route) return res.status(404).json({ error: 'Transport route not found' });
    res.json({ message: 'Transport route deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete transport route', details: err.message });
  }
});

export default router;
