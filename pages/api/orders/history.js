// pages/api/orders/history.js
import pool from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // گرفتن تاریخچه سفارش‌ها از جدول order_history
    // فرض: جدول order_history شامل فیلدهای: id, order_id, field, oldValue, newValue, changedAt, changedBy
    // همچنین جدول orders شامل اطلاعات مشتری است
    const [rows] = await pool.query(`
      SELECT oh.order_id, o.customer_name, oh.field, oh.oldValue, oh.newValue, oh.changedAt, oh.changedBy
      FROM order_history oh
      JOIN orders o ON oh.order_id = o.id
    `);

    const historyList = rows.map((h) => ({
      orderId: h.order_id,
      customerName: h.customer_name,
      field: h.field,
      oldValue: h.oldValue,
      newValue: h.newValue,
      changedAt: h.changedAt,
      changedBy: h.changedBy || 'ناشناس',
    }));

    // مرتب‌سازی نزولی بر اساس زمان تغییر
    historyList.sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt));

    res.status(200).json(historyList);
  } catch (error) {
    console.error('خطا در دریافت تاریخچه سفارش‌ها:', error);
    res.status(500).json({ message: 'خطا در دریافت تاریخچه سفارش‌ها' });
  }
}