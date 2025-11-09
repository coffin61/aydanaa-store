import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === 'POST') {
    const { items, total, customer } = req.body;

    const order = await Order.create({
      items,
      total,
      customer,
      status: 'در انتظار پرداخت',
    });

    // اینجا می‌تونی به درگاه پرداخت وصل بشی (مثلاً زرین‌پال)
    // برای تست، فقط آدرس فرضی می‌دیم:
    const fakeGatewayUrl = `https://example.com/pay/${order._id}`;

    res.status(201).json({ orderId: order._id, payUrl: fakeGatewayUrl });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}