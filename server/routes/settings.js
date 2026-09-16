import express from 'express';
import { User } from '../models/User.js';

const router = express.Router();

// GET user settings
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('settings');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings', details: err.message });
  }
});

// PUT update settings
router.put('/:userId', async (req, res) => {
  try {
    const { language, theme, notifications, emailAlerts } = req.body;
    const updateObj = {};
    if (language !== undefined) updateObj['settings.language'] = language;
    if (theme !== undefined) updateObj['settings.theme'] = theme;
    if (notifications !== undefined) updateObj['settings.notifications'] = notifications;
    if (emailAlerts !== undefined) updateObj['settings.emailAlerts'] = emailAlerts;

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updateObj },
      { new: true, runValidators: true }
    ).select('settings');

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'Settings updated successfully', settings: user.settings });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update settings', details: err.message });
  }
});

export default router;
