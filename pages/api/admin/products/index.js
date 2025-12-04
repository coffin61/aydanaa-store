import connectDB from '@/lib/db';

import Product from '@/models/Product';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== 'admin') {
    return res.status(403).json({ message: '⛔ فقط مدیران مجاز هستند' });
  }

  if (req.method === 'GET') {
    const { category, search } = req.query;
    const query = {};

    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };

    const products = await Product.find(query).sort({ createdAt: -1 });
    return res.status(200).json({ products });
  }

  if (req.method === 'POST') {
    const { title, slug, description, price, image, category, inStock } = req.body;
    if (!title || !slug || !price) {
      return res.status(400).json({ message: 'عنوان، اسلاگ و قیمت الزامی هستند' });
    }

    const exists = await Product.findOne({ slug });
    if (exists) return res.status(409).json({ message: 'محصولی با این اسلاگ وجود دارد' });

    const product = await Product.create({ title, slug, description, price, image, category, inStock });
    return res.status(201).json({ message: '✅ محصول اضافه شد', product });
  }

  return res.status(405).end();
}