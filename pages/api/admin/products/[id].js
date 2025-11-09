import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== 'admin') {
    return res.status(403).json({ message: '⛔ فقط مدیران مجاز هستند' });
  }

  const { id } = req.query;

  if (req.method === 'PUT') {
    const { title, slug, description, price, image, category, inStock } = req.body;
    const updated = await Product.findByIdAndUpdate(
      id,
      { title, slug, description, price, image, category, inStock },
      { new: true }
    );
    return res.status(200).json({ message: '✅ محصول بروزرسانی شد', product: updated });
  }

  if (req.method === 'DELETE') {
    await Product.findByIdAndDelete(id);
    return res.status(200).json({ message: '🗑️ محصول حذف شد' });
  }

  return res.status(405).end();
}