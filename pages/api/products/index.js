import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === 'POST') {
    const { title, slug, price, description, category, image, stock } = req.body;
    const newProduct = await Product.create({
      title,
      slug,
      price,
      description,
      category,
      image,
      stock,
    });
    return res.status(201).json(newProduct);
  }

  if (req.method === 'GET') {
    const products = await Product.find().populate('category').lean();
    return res.status(200).json(products);
  }

  res.status(405).json({ message: 'Method not allowed' });
}