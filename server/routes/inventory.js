import express from 'express';
import { Inventory } from '../models/Inventory.js';

const router = express.Router();

// GET all inventory items
router.get('/', async (req, res) => {
  try {
    const { category, condition, lowStock } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (condition) filter.condition = condition;
    if (lowStock === 'true') {
      filter.$expr = { $lte: ['$quantity', '$minimumStock'] };
    }

    const items = await Inventory.find(filter).sort({ name: 1 });
    res.json({ count: items.length, items });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inventory', details: err.message });
  }
});

// GET inventory item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Inventory item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inventory item', details: err.message });
  }
});

// POST create inventory item
router.post('/', async (req, res) => {
  try {
    const item = new Inventory(req.body);
    await item.save();
    res.status(201).json({ message: 'Inventory item added successfully', item });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add inventory item', details: err.message });
  }
});

// PUT update inventory item
router.put('/:id', async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Inventory item not found' });
    Object.assign(item, req.body);
    await item.save(); // triggers pre-save for totalValue
    res.json({ message: 'Inventory item updated successfully', item });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update inventory item', details: err.message });
  }
});

// DELETE inventory item
router.delete('/:id', async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Inventory item not found' });
    res.json({ message: 'Inventory item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete inventory item', details: err.message });
  }
});

export default router;
