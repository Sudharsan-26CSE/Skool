const mongoose = require('mongoose');

const libraryBookSchema = new mongoose.Schema({
  isbn:            { type: String, unique: true },
  title:           { type: String, required: true },
  author:          { type: String, required: true },
  category:        { type: String },
  publisher:       { type: String },
  publishYear:     { type: Number },
  totalCopies:     { type: Number, default: 1 },
  availableCopies: { type: Number, default: 1 },
  location:        { type: String },
  borrowedBy:      [{
    student:    { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    borrowedAt: { type: Date, default: Date.now },
    dueDate:    { type: Date },
    returnedAt: { type: Date },
  }],
}, { timestamps: true });

module.exports = mongoose.model('LibraryBook', libraryBookSchema);
