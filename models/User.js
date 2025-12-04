// models/User.js
const pool = require('../lib/db');

// گرفتن همه کاربران
async function getAllUsers() {
  const [rows] = await pool.query('SELECT * FROM users');
  return rows;
}

// گرفتن یک کاربر با id
async function getUserById(id) {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
}

// گرفتن یک کاربر با ایمیل (برای لاگین یا ثبت‌نام)
async function getUserByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}

// ایجاد کاربر جدید
async function createUser(email, name, password, image = '', role = 'user') {
  const [result] = await pool.query(
    'INSERT INTO users (email, name, password, image, role) VALUES (?, ?, ?, ?, ?)',
    [email, name, password, image, role]
  );
  return result.insertId;
}

// بروزرسانی اطلاعات کاربر
async function updateUser(id, fields) {
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (keys.length === 0) return;

  const setClause = keys.map(key => `${key} = ?`).join(', ');
  await pool.query(`UPDATE users SET ${setClause} WHERE id = ?`, [...values, id]);
}

// حذف کاربر
async function deleteUser(id) {
  await pool.query('DELETE FROM users WHERE id = ?', [id]);
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
};