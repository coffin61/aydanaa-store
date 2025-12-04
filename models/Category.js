// models/Category.js
const pool = require('../lib/db');

// گرفتن همه دسته‌ها
async function getAllCategories() {
  const [rows] = await pool.query('SELECT * FROM categories');
  return rows;
}

// گرفتن یک دسته با id
async function getCategoryById(id) {
  const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
  return rows[0];
}

// اضافه کردن دسته جدید
async function createCategory(name, slug) {
  const [result] = await pool.query(
    'INSERT INTO categories (name, slug) VALUES (?, ?)',
    [name, slug]
  );
  return result.insertId;
}

// ویرایش دسته
async function updateCategory(id, name, slug) {
  await pool.query(
    'UPDATE categories SET name = ?, slug = ? WHERE id = ?',
    [name, slug, id]
  );
}

// حذف دسته
async function deleteCategory(id) {
  await pool.query('DELETE FROM categories WHERE id = ?', [id]);
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};