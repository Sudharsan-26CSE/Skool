import mongoose from 'mongoose';

const ExamResultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClassManagement',
      required: true,
    },
    examType: {
      type: String,
      enum: ['unit-test', 'mid-term', 'quarterly', 'half-yearly', 'annual', 'other'],
      required: true,
    },
    examDate: {
      type: Date,
      required: true,
    },
    marksObtained: {
      type: Number,
      required: true,
      min: 0,
    },
    totalMarks: {
      type: Number,
      required: true,
      min: 1,
    },
    grade: {
      type: String,
      trim: true,
    },
    percentage: Number,
    remarks: String,
    academicYear: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Auto-calculate percentage before saving
ExamResultSchema.pre('save', function (next) {
  if (this.marksObtained != null && this.totalMarks) {
    this.percentage = parseFloat(((this.marksObtained / this.totalMarks) * 100).toFixed(2));
  }
  next();
});

export const ExamResult = mongoose.model('ExamResult', ExamResultSchema);
