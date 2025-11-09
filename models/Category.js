import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    description: String,
  },
  { timestamps: true }
);

export default mongoose.models.Category || mongoose.model('Category', categorySchema);