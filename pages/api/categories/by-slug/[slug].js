import { connectDB } from '../../../../lib/db.js';
import Product from '../../../../models/Product.js';
import Category from '../../../../models/Category.js';

export default async function handler(req, res) {
  await connectDB();
  const { slug } = req.query;

  if (req.method === 'GET') {
    const category = await Category.findOne({ slug });
    if (!category) {
      return res.status(404).json({ message: 'دسته‌بندی یافت نشد' });
    }

    const products = await Product.find({ category: category._id });
    return res.status(200).json({ category, products });
  }

  res.status(405).end();
}