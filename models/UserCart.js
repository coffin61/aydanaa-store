// models/UserCart.js
const pool = require('../lib/db');

// گرفتن سبد خرید یک کاربر
async function getCartByUserId(userId) {
  const [rows] = await pool.query('SELECT * FROM user_cart WHERE user_id = ?', [userId]);
  return rows;
}

// افزودن آیتم به سبد خرید
async function addToCart(userId, productId, quantity = 1) {
  const [result] = await pool.query(
    'INSERT INTO user_cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
    [userId, productId, quantity]
  );
  return result.insertId;
}

// بروزرسانی تعداد آیتم
async function updateCartItem(userId, productId, quantity) {
  await pool.query(
    'UPDATE user_cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
    [quantity, userId, productId]
  );
}

// حذف آیتم از سبد خرید
async function removeFromCart(userId, productId) {
  await pool.query(
    'DELETE FROM user_cart WHERE user_id = ? AND product_id = ?',
    [userId, productId]
  );
}

module.exports = {
  getCartByUserId,
  addToCart,
  updateCartItem,
  removeFromCart,
};