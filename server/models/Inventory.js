import mongoose from 'mongoose';

const InventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['furniture', 'electronics', 'stationery', 'sports', 'lab-equipment', 'cleaning', 'kitchen', 'other'],
    },
    description: String,
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      default: 'pieces',
    },
    unitPrice: {
      type: Number,
      default: 0,
    },
    totalValue: Number,
    supplier: {
      name: String,
      phone: String,
      email: String,
      address: String,
    },
    purchaseDate: Date,
    warrantyExpiry: Date,
    location: String,
    condition: {
      type: String,
      enum: ['new', 'good', 'fair', 'poor', 'damaged'],
      default: 'new',
    },
    minimumStock: {
      type: Number,
      default: 5,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Auto-calculate total value
InventorySchema.pre('save', function (next) {
  this.totalValue = (this.quantity || 0) * (this.unitPrice || 0);
  next();
});

export const Inventory = mongoose.model('Inventory', InventorySchema);
