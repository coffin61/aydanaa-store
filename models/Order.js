// models/Order.js
const pool = require('../lib/db');

// گرفتن همه سفارش‌ها
async function getAllOrders() {
  const [rows] = await pool.query('SELECT * FROM orders');
  return rows;
}

// گرفتن یک سفارش با id
async function getOrderById(id) {
  const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
  return rows[0];
}

// ایجاد سفارش جدید
async function createOrder(email, items, total, status = 'در انتظار پرداخت') {
  // ذخیره سفارش اصلی
  const [result] = await pool.query(
    'INSERT INTO orders (email, total, status) VALUES (?, ?, ?)',
    [email, total, status]
  );
  const orderId = result.insertId;

  // ذخیره آیتم‌های سفارش
  for (const item of items) {
    await pool.query(
      'INSERT INTO order_items (order_id, product_id, title, price, quantity) VALUES (?, ?, ?, ?, ?)',
      [orderId, item.productId, item.title, item.price, item.quantity]
    );
  }

  return orderId;
}

// بروزرسانی وضعیت سفارش
async function updateOrderStatus(id, status) {
  await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
}

// حذف سفارش
async function deleteOrder(id) {
  await pool.query('DELETE FROM order_items WHERE order_id = ?', [id]);
  await pool.query('DELETE FROM orders WHERE id = ?', [id]);
}

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};