import express from 'express';
import { Library } from '../models/Library.js';

const router = express.Router();

// GET all books
router.get('/', async (req, res) => {
  try {
    const { category, subject, search } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (subject) filter.subject = subject;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } },
      ];
    }

    const books = await Library.find(filter).sort({ title: 1 });
    res.json({ count: books.length, books });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch books', details: err.message });
  }
});

// GET book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Library.findById(req.params.id)
      .populate('issuedBooks.user', 'name email role');
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch book', details: err.message });
  }
});

// POST add book
router.post('/', async (req, res) => {
  try {
    const book = new Library(req.body);
    await book.save();
    res.status(201).json({ message: 'Book added successfully', book });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Book with this ISBN already exists' });
    }
    res.status(500).json({ error: 'Failed to add book', details: err.message });
  }
});

// PUT update book
router.put('/:id', async (req, res) => {
  try {
    const book = await Library.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book updated successfully', book });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update book', details: err.message });
  }
});

// POST issue book
router.post('/:id/issue', async (req, res) => {
  try {
    const book = await Library.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    if (book.availableCopies <= 0) return res.status(400).json({ error: 'No copies available' });

    book.issuedBooks.push(req.body);
    book.availableCopies -= 1;
    await book.save();
    res.json({ message: 'Book issued successfully', book });
  } catch (err) {
    res.status(500).json({ error: 'Failed to issue book', details: err.message });
  }
});

// PUT return book
router.put('/:id/return/:issueId', async (req, res) => {
  try {
    const book = await Library.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    const issue = book.issuedBooks.id(req.params.issueId);
    if (!issue) return res.status(404).json({ error: 'Issue record not found' });

    issue.returnedDate = new Date();
    issue.status = 'returned';
    issue.fine = req.body.fine || 0;
    book.availableCopies += 1;
    await book.save();
    res.json({ message: 'Book returned successfully', book });
  } catch (err) {
    res.status(500).json({ error: 'Failed to return book', details: err.message });
  }
});

// DELETE book
router.delete('/:id', async (req, res) => {
  try {
    const book = await Library.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete book', details: err.message });
  }
});

export default router;
