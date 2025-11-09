import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data));

    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const filtered = selectedCategory
    ? products.filter((p) => p.category?._id === selectedCategory)
    : products;

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold text-purple-700">🛍 محصولات فروشگاه</h1>

      {/* فیلتر دسته‌بندی */}
      <div className="mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border px-4 py-2 rounded w-full max-w-xs"
        >
          <option value="">همه دسته‌ها</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.title}
            </option>
          ))}
        </select>
      </div>

      {/* نمایش محصولات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((product) => (
          <div
            key={product._id}
            className="border rounded-lg p-4 hover:shadow-md transition space-y-3"
          >
            <img
              src={product.image || '/placeholder.png'}
              alt={product.title}
              className="w-full h-48 object-cover rounded"
            />
            <h2 className="text-lg font-semibold text-gray-800">{product.title}</h2>
            <p className="text-sm text-gray-500">
              {product.category?.title || 'بدون دسته‌بندی'}
            </p>
            <p className="text-green-700 font-bold text-base">
              {product.price.toLocaleString()} تومان
            </p>
            <Link href={`/products/${product.slug}`}>
              <span className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 cursor-pointer text-sm">
                مشاهده جزئیات
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}