import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';

export default async function handler(req, res) {
  try {
    await connectToDatabase();

    // فقط سفارش‌هایی که تاریخچه دارند
    const ordersWithHistory = await Order.find({
      history: { $exists: true, $not: { $size: 0 } },
    })
      .select('_id customer history')
      .lean();

    const historyList = [];

    ordersWithHistory.forEach((order) => {
      order.history.forEach((h) => {
        historyList.push({
          orderId: order._id,
          customerName: order.customer.name,
          field: h.field,
          oldValue: h.oldValue,
          newValue: h.newValue,
          changedAt: h.changedAt,
          changedBy: h.changedBy || 'ناشناس',
        });
      });
    });

    // مرتب‌سازی نزولی بر اساس زمان تغییر
    historyList.sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt));

    res.status(200).json(historyList);
  } catch (error) {
    console.error('خطا در دریافت تاریخچه سفارش‌ها:', error);
    res.status(500).json({ message: 'خطا در دریافت تاریخچه سفارش‌ها' });
  }
}