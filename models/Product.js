// models/Product.js
const pool = require('../lib/db');

// گرفتن همه محصولات
async function getAllProducts() {
  const [rows] = await pool.query('SELECT * FROM products');
  return rows;
}

// گرفتن محصول با id
async function getProductById(id) {
  const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
  return rows[0];
}

// گرفتن محصول با slug
async function getProductBySlug(slug) {
  const [rows] = await pool.query('SELECT * FROM products WHERE slug = ?', [slug]);
  return rows[0];
}

// ایجاد محصول جدید
async function createProduct(name, slug, price, category_id) {
  const [result] = await pool.query(
    'INSERT INTO products (name, slug, price, category_id) VALUES (?, ?, ?, ?)',
    [name, slug, price, category_id]
  );
  return result.insertId;
}

module.exports = {
  getAllProducts,
  getProductById,
  getProductBySlug,
  createProduct,
};