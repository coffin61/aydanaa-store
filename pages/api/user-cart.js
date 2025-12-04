// pages/api/user-cart.js
import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, cart } = req.body;

    if (!email || !Array.isArray(cart)) {
      return res.status(400).json({ message: 'اطلاعات ناقص یا نامعتبر است' });
    }

    try {
      // پاک کردن سبد قبلی
      await pool.query('DELETE FROM user_cart WHERE email = ?', [email]);

      // ذخیره آیتم‌های جدید
      for (const item of cart) {
        await pool.query(
          'INSERT INTO user_cart (email, product_id, title, price, quantity) VALUES (?, ?, ?, ?, ?)',
          [email, item.product_id || null, item.title, item.price, item.quantity]
        );
      }

      return res.status(200).json({ message: '✅ سبد خرید ذخیره شد', cart });
    } catch (err) {
      console.error('❌ خطا در ذخیره‌سازی سبد:', err);
      return res.status(500).json({ message: '❌ خطا در ذخیره‌سازی سبد', error: err.message });
    }
  }

  if (req.method === 'GET') {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'ایمیل لازم است' });

    try {
      const [rows] = await pool.query('SELECT * FROM user_cart WHERE email = ?', [email]);
      if (rows.length === 0) return res.status(404).json({ message: 'سبد خریدی یافت نشد' });

      return res.status(200).json({ cart: rows });
    } catch (err) {
      console.error('❌ خطا در دریافت سبد:', err);
      return res.status(500).json({ message: '❌ خطا در دریافت سبد', error: err.message });
    }
  }

  res.status(405).json({ message: 'متد مجاز نیست' });
}