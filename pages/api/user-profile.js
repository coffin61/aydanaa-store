import { connectDB } from '@/lib/db';
import User from '@/models/User'; // مطمئن شو مدل User وجود داره و ایمیل unique هست

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'متد مجاز نیست' });
  }

  const { email, name, image } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'ایمیل لازم است' });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        ...(name && { name }),
        ...(image && { image }),
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'کاربری با این ایمیل یافت نشد' });
    }

    return res.status(200).json({
      message: '✅ اطلاعات کاربر با موفقیت بروزرسانی شد',
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: '❌ خطا در بروزرسانی اطلاعات',
      error: err.message,
    });
  }
}