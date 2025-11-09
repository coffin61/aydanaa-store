import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method !== 'POST') return res.status(405).end();

  const { authority, amount, orderId } = req.body;

  const response = await fetch('https://api.zarinpal.com/pg/v4/payment/verify.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
      amount,
      authority,
    }),
  });

  const result = await response.json();

  if (result.data.code === 100) {
    await Order.findByIdAndUpdate(orderId, {
      status: 'پرداخت‌شده',
      paymentRef: result.data.ref_id,
    });
  }

  res.status(200).json(result.data);
}