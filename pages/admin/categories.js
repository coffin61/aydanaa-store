import { useEffect, useState } from 'react';

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [parent, setParent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const handleAdd = async () => {
    setLoading(true);
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, slug, parent }),
    });
    const newCat = await res.json();
    setCategories((prev) => [...prev, newCat]);
    setTitle('');
    setSlug('');
    setParent('');
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('حذف این دسته؟')) return;
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    setCategories((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold text-blue-700">📁 مدیریت دسته‌بندی‌ها</h1>

      <div className="bg-white shadow p-4 rounded space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="عنوان دسته"
          className="border w-full px-4 py-2 rounded"
        />
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="نامک (slug)"
          className="border w-full px-4 py-2 rounded"
        />
        <select
          value={parent}
          onChange={(e) => setParent(e.target.value)}
          className="border w-full px-4 py-2 rounded"
        >
          <option value="">بدون والد</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.title}
            </option>
          ))}
        </select>
        <button
          onClick={handleAdd}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? 'در حال افزودن...' : '➕ افزودن دسته'}
        </button>
      </div>

      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">📂 لیست دسته‌ها</h2>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat._id} className="flex justify-between items-center border-b pb-2">
              <span>
                {cat.title} {cat.parent && <span className="text-sm text-gray-500">← زیرمجموعه</span>}
              </span>
              <button
                onClick={() => handleDelete(cat._id)}
                className="text-red-600 hover:underline"
              >
                حذف
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}