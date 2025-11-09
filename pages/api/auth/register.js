import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'لطفاً همه فیلدها را کامل کنید' });
  }

  await connectDB();

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: 'این ایمیل قبلاً ثبت شده است' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  return res.status(201).json({ message: 'ثبت‌نام موفق بود', userId: user._id });
}