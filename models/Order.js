import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        title: String,
        price: Number,
        quantity: Number,
      },
    ],
    total: Number,
    status: { type: String, default: 'در انتظار پرداخت' },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', orderSchema);