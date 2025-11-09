import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== 'POST') return res.status(405).end();

  const { email, name, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'ایمیل و رمز عبور الزامی است' });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: '❌ این ایمیل قبلاً ثبت شده است' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, name, password: hashed });

  return res.status(201).json({ message: '✅ ثبت‌نام با موفقیت انجام شد', user });
}