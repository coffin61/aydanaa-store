// pages/api/zarinpal/verify.js
import pool from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { authority, amount, orderId } = req.body;

  try {
    // درخواست به API زرین‌پال برای تایید پرداخت
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
      // به‌روزرسانی وضعیت سفارش در MySQL
      await pool.query(
        'UPDATE orders SET status = ?, paymentRef = ? WHERE id = ?',
        ['پرداخت‌شده', result.data.ref_id, orderId]
      );
    }

    res.status(200).json(result.data);
  } catch (error) {
    console.error('❌ خطا در تایید پرداخت:', error);
    res.status(500).json({ message: 'خطا در تایید پرداخت' });
  }
}