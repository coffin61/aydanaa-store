import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold text-blue-700">دسته‌بندی‌ها</h1>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <li key={cat._id} className="border p-4 rounded shadow hover:shadow-md">
            <Link href={`/category/${cat.slug}`}>
              <div className="space-y-2 cursor-pointer">
                <h2 className="text-xl font-semibold text-gray-800">{cat.title}</h2>
                <p className="text-gray-600">{cat.description || 'بدون توضیح'}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}