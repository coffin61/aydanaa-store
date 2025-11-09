import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []));
  }, []);

  const handleDelete = async (id) => {
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setMessage('✅ دسته حذف شد');
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
    } else {
      setMessage('❌ خطا در حذف دسته');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold text-blue-700">🛠️ مدیریت دسته‌بندی‌ها</h1>

      <Link href="/admin/categories/new">
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          ➕ افزودن دسته جدید
        </button>
      </Link>

      {message && <p className="text-sm pt-4">{message}</p>}

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
        {categories.map((cat) => (
          <li key={cat._id} className="border p-4 rounded shadow space-y-2">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{cat.title}</h2>
              <p className="text-sm text-gray-600">{cat.description}</p>
              <p className="text-xs text-gray-400">slug: {cat.slug}</p>
            </div>
            <div className="flex gap-4 pt-2">
              <Link href={`/admin/categories/edit/${cat._id}`}>
                <button className="text-blue-600 hover:underline">✏️ ویرایش</button>
              </Link>
              <button
                onClick={() => handleDelete(cat._id)}
                className="text-red-600 hover:underline"
              >
                🗑️ حذف
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}