import { connectDB } from '@/lib/db';
import UserCart from '@/models/UserCart';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'POST') {
    const { email, cart } = req.body;

    if (!email || !Array.isArray(cart)) {
      return res.status(400).json({ message: 'اطلاعات ناقص یا نامعتبر است' });
    }

    try {
      const updated = await UserCart.findOneAndUpdate(
        { email },
        { items: cart },
        { upsert: true, new: true }
      );
      return res.status(200).json({ message: '✅ سبد خرید ذخیره شد', cart: updated });
    } catch (err) {
      return res.status(500).json({ message: '❌ خطا در ذخیره‌سازی سبد', error: err.message });
    }
  }

  if (req.method === 'GET') {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'ایمیل لازم است' });

    try {
      const userCart = await UserCart.findOne({ email });
      if (!userCart) return res.status(404).json({ message: 'سبد خریدی یافت نشد' });
      return res.status(200).json({ cart: userCart.items });
    } catch (err) {
      return res.status(500).json({ message: '❌ خطا در دریافت سبد', error: err.message });
    }
  }

  res.status(405).json({ message: 'متد مجاز نیست' });
}