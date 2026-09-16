import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        'student-progress',
        'attendance-summary',
        'fee-collection',
        'exam-analysis',
        'staff-payroll',
        'inventory-stock',
        'financial-summary',
        'class-performance',
        'custom',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dateRange: {
      from: Date,
      to: Date,
    },
    filters: {
      class: { type: mongoose.Schema.Types.ObjectId, ref: 'ClassManagement' },
      student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
      staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
      academicYear: String,
    },
    data: mongoose.Schema.Types.Mixed,
    format: {
      type: String,
      enum: ['json', 'pdf', 'csv', 'excel'],
      default: 'json',
    },
    fileUrl: String,
    status: {
      type: String,
      enum: ['generating', 'completed', 'failed'],
      default: 'completed',
    },
  },
  { timestamps: true }
);

export const Report = mongoose.model('Report', ReportSchema);
