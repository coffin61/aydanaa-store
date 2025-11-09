import { connectDB } from '@/lib/db';
import Order from '@/models/Order';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'POST') {
    const { email, items, total } = req.body;

    if (!email || !Array.isArray(items) || typeof total !== 'number') {
      return res.status(400).json({ message: 'اطلاعات ناقص یا نامعتبر است' });
    }

    try {
      const order = await Order.create({ email, items, total });
      return res.status(201).json({ message: '✅ سفارش ثبت شد', order });
    } catch (err) {
      return res.status(500).json({ message: '❌ خطا در ثبت سفارش', error: err.message });
    }
  }

  if (req.method === 'GET') {
    const { email } = req.query;

    if (!email) return res.status(400).json({ message: 'ایمیل لازم است' });

    try {
      const orders = await Order.find({ email }).sort({ createdAt: -1 });
      return res.status(200).json({ orders });
    } catch (err) {
      return res.status(500).json({ message: '❌ خطا در دریافت سفارش‌ها', error: err.message });
    }
  }

  res.status(405).json({ message: 'متد مجاز نیست' });
}