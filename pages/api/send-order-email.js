import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== 'POST') return res.status(405).end();

  const { email, orderId } = req.body;
  if (!email || !orderId) return res.status(400).json({ message: 'اطلاعات ناقص است' });

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: 'سفارش یافت نشد' });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const html = `
    <h2>سفارش شما ثبت شد ✅</h2>
    <p>مجموع: ${order.total} تومان</p>
    <ul>
      ${order.items
        .map(
          (item) =>
            `<li>${item.title} - ${item.quantity} عدد - ${item.price} تومان</li>`
        )
        .join('')}
    </ul>
  `;

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: 'تأیید سفارش Aydanaa',
    html,
  });

  return res.status(200).json({ message: '📧 ایمیل سفارش ارسال شد' });
}