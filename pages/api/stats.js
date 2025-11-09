import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';

export default async function handler(req, res) {
  try {
    await connectToDatabase();
    const orders = await Order.find();

    // دسته‌بندی محصولات
    const categoryStats = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const cat = item.category || 'نامشخص';
        if (!categoryStats[cat]) {
          categoryStats[cat] = { total: 0, count: 0 };
        }
        categoryStats[cat].total += item.price * item.quantity;
        categoryStats[cat].count += item.quantity;
      });
    });

    res.status(200).json({ orders, categoryStats });
  } catch (error) {
    console.error('خطا در دریافت سفارش‌ها:', error);
    res.status(500).json({ message: 'خطا در دریافت داده‌ها' });
  }
}