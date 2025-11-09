import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';

export default async function handler(req, res) {
  try {
    await connectToDatabase();

    // دریافت سفارش‌هایی که تاریخچه دارند
    const orders = await Order.find({
      history: { $exists: true, $not: { $size: 0 } },
    }).select('history').lean();

    const stats = {};

    orders.forEach((order) => {
      order.history.forEach((h) => {
        const date = new Date(h.changedAt).toISOString().slice(0, 10); // YYYY-MM-DD
        const field = h.field;
        const user = h.changedBy || 'ناشناس';

        // ساختار آماری برای هر روز
        if (!stats[date]) {
          stats[date] = {
            total: 0,
            status: 0,
            note: 0,
            users: {},
          };
        }

        stats[date].total += 1;
        if (field === 'status') stats[date].status += 1;
        if (field === 'note') stats[date].note += 1;

        stats[date].users[user] = (stats[date].users[user] || 0) + 1;
      });
    });

    res.status(200).json(stats);
  } catch (error) {
    console.error('❌ خطا در تولید آمار تاریخچه سفارش‌ها:', error);
    res.status(500).json({ message: 'خطا در تولید آمار' });
  }
}