import { connectDB } from '@/lib/db';
import Product from '@/models/Product';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ message: 'slug محصول ارسال نشده' });
  }

  await connectDB();

  const product = await Product.findOne({ slug }).populate('category');

  if (!product) {
    return res.status(404).json({ message: 'محصولی با این slug یافت نشد' });
  }

  return res.status(200).json(product);
}