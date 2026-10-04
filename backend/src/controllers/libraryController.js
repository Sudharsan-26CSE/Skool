const asyncHandler = require('express-async-handler');
const LibraryBook = require('../models/LibraryBook');

exports.getBooks = asyncHandler(async (req, res) => {
  const { category, search, available } = req.query;
  let query = {};
  if (category)  query.category = category;
  if (available === 'true') query.availableCopies = { $gt: 0 };
  let books = await LibraryBook.find(query).sort({ title: 1 });
  if (search) books = books.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()));
  res.json({ success: true, count: books.length, books });
});

exports.getBook = asyncHandler(async (req, res) => {
  const book = await LibraryBook.findById(req.params.id).populate('borrowedBy.student', 'admissionNo user');
  if (!book) { res.status(404); throw new Error('Book not found'); }
  res.json({ success: true, book });
});

exports.createBook = asyncHandler(async (req, res) => {
  const book = await LibraryBook.create(req.body);
  res.status(201).json({ success: true, book });
});

exports.updateBook = asyncHandler(async (req, res) => {
  const book = await LibraryBook.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!book) { res.status(404); throw new Error('Book not found'); }
  res.json({ success: true, book });
});

exports.deleteBook = asyncHandler(async (req, res) => {
  const book = await LibraryBook.findByIdAndDelete(req.params.id);
  if (!book) { res.status(404); throw new Error('Book not found'); }
  res.json({ success: true, message: 'Book deleted' });
});

exports.borrowBook = asyncHandler(async (req, res) => {
  const { studentId, dueDate } = req.body;
  const book = await LibraryBook.findById(req.params.id);
  if (!book) { res.status(404); throw new Error('Book not found'); }
  if (book.availableCopies < 1) { res.status(400); throw new Error('No copies available'); }
  book.borrowedBy.push({ student: studentId, dueDate: new Date(dueDate) });
  book.availableCopies -= 1;
  await book.save();
  res.json({ success: true, message: 'Book issued', availableCopies: book.availableCopies });
});

exports.returnBook = asyncHandler(async (req, res) => {
  const { studentId } = req.body;
  const book = await LibraryBook.findById(req.params.id);
  if (!book) { res.status(404); throw new Error('Book not found'); }
  const record = book.borrowedBy.find(b => b.student?.toString() === studentId && !b.returnedAt);
  if (!record) { res.status(400); throw new Error('No active borrow record found'); }
  record.returnedAt = new Date();
  book.availableCopies += 1;
  await book.save();
  res.json({ success: true, message: 'Book returned', availableCopies: book.availableCopies });
});
