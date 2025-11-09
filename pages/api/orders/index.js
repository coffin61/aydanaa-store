import { connectDB } from '../../../lib/db.js';
import Order from '../../../models/Order.js';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'POST') {
    const { customerName, customerEmail, items, totalPrice } = req.body;

    if (!customerName || !customerEmail || !items?.length || !totalPrice) {
      return res.status(400).json({ message: 'اطلاعات سفارش ناقص است' });
    }

    const order = await Order.create({
      customerName,
      customerEmail,
      items,
      totalPrice,
    });

    return res.status(201).json({ order });
  }

  if (req.method === 'GET') {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.status(200).json({ orders });
  }

  res.status(405).end();
}