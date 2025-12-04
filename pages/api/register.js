// pages/api/register.js
import bcrypt from 'bcryptjs'; // یا bcrypt اگر نصب کردی
import { createUser, getUserByEmail } from '../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, name, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'ایمیل و رمز عبور الزامی است' });
  }

  try {
    // بررسی وجود کاربر
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: '❌ این ایمیل قبلاً ثبت شده است' });
    }

    // هش کردن رمز عبور
    const hashedPassword = await bcrypt.hash(password, 10);

    // ایجاد کاربر جدید
    const userId = await createUser(email, name || '', hashedPassword);

    return res.status(201).json({
      message: '✅ ثبت‌نام با موفقیت انجام شد',
      userId,
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'خطای سرور' });
  }
}