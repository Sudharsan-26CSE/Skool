import express from 'express';
import { AdminSettings } from '../models/AdminSettings.js';

const router = express.Router();

// GET admin settings (creates default if none exists)
router.get('/', async (req, res) => {
  try {
    let settings = await AdminSettings.findOne({ isSingleton: true });
    if (!settings) {
      settings = await AdminSettings.create({ isSingleton: true });
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin settings', details: err.message });
  }
});

// GET only module toggles
router.get('/modules', async (req, res) => {
  try {
    let settings = await AdminSettings.findOne({ isSingleton: true }).select('modules');
    if (!settings) {
      settings = await AdminSettings.create({ isSingleton: true });
    }
    res.json(settings.modules);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch module settings', details: err.message });
  }
});

// PUT update admin settings
router.put('/', async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData.isSingleton; // Prevent removing singleton marker
    delete updateData._id;

    const settings = await AdminSettings.findOneAndUpdate(
      { isSingleton: true },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ message: 'Admin settings updated successfully', settings });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: 'Validation failed', details: messages.join(', ') });
    }
    res.status(500).json({ error: 'Failed to update admin settings', details: err.message });
  }
});

// PUT update only module toggles
router.put('/modules', async (req, res) => {
  try {
    const moduleUpdates = {};
    for (const [key, value] of Object.entries(req.body)) {
      if (typeof value === 'boolean') {
        moduleUpdates[`modules.${key}`] = value;
      }
    }

    const settings = await AdminSettings.findOneAndUpdate(
      { isSingleton: true },
      { $set: moduleUpdates },
      { new: true, upsert: true, runValidators: true }
    ).select('modules');

    res.json({ message: 'Module settings updated successfully', modules: settings.modules });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update module settings', details: err.message });
  }
});

export default router;
