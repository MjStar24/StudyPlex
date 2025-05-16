import mongoose from 'mongoose';

const centerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  address: {
    street: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const Center = mongoose.model('Center', centerSchema);
export default Center


