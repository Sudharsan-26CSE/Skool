import express from 'express';
import { Account } from '../models/Account.js';

const router = express.Router();

// GET all accounts
router.get('/', async (req, res) => {
  try {
    const { type, category, from, to } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }

    const accounts = await Account.find(filter)
      .populate('createdBy', 'name')
      .sort({ date: -1 });
    res.json({ count: accounts.length, accounts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch accounts', details: err.message });
  }
});

// GET account summary
router.get('/summary', async (req, res) => {
  try {
    const { from, to, academicYear } = req.query;
    const filter = {};
    if (academicYear) filter.academicYear = academicYear;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }

    const [income, expense] = await Promise.all([
      Account.aggregate([{ $match: { ...filter, type: 'income' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Account.aggregate([{ $match: { ...filter, type: 'expense' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    ]);

    res.json({
      totalIncome: income[0]?.total || 0,
      totalExpense: expense[0]?.total || 0,
      netBalance: (income[0]?.total || 0) - (expense[0]?.total || 0),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch summary', details: err.message });
  }
});

// GET account by ID
router.get('/:id', async (req, res) => {
  try {
    const account = await Account.findById(req.params.id).populate('createdBy', 'name');
    if (!account) return res.status(404).json({ error: 'Account entry not found' });
    res.json(account);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch account', details: err.message });
  }
});

// POST create account entry
router.post('/', async (req, res) => {
  try {
    const account = new Account(req.body);
    await account.save();
    res.status(201).json({ message: 'Account entry created successfully', account });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create account entry', details: err.message });
  }
});

// PUT update account
router.put('/:id', async (req, res) => {
  try {
    const account = await Account.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('createdBy', 'name');
    if (!account) return res.status(404).json({ error: 'Account entry not found' });
    res.json({ message: 'Account entry updated successfully', account });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update account entry', details: err.message });
  }
});

// DELETE account
router.delete('/:id', async (req, res) => {
  try {
    const account = await Account.findByIdAndDelete(req.params.id);
    if (!account) return res.status(404).json({ error: 'Account entry not found' });
    res.json({ message: 'Account entry deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete account entry', details: err.message });
  }
});

export default router;
