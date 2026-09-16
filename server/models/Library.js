import mongoose from 'mongoose';

const LibrarySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    isbn: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    publisher: String,
    category: {
      type: String,
      enum: ['textbook', 'reference', 'fiction', 'non-fiction', 'magazine', 'journal', 'other'],
      default: 'textbook',
    },
    subject: String,
    language: {
      type: String,
      default: 'English',
    },
    edition: String,
    totalCopies: {
      type: Number,
      required: true,
      min: 1,
    },
    availableCopies: {
      type: Number,
      required: true,
      min: 0,
    },
    shelfLocation: String,
    coverImage: String,
    issuedBooks: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        issuedDate: { type: Date, default: Date.now },
        dueDate: Date,
        returnedDate: Date,
        fine: { type: Number, default: 0 },
        status: {
          type: String,
          enum: ['issued', 'returned', 'overdue', 'lost'],
          default: 'issued',
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Library = mongoose.model('Library', LibrarySchema);
