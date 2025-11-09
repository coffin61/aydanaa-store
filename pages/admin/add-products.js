import { useEffect, useState } from 'react';

export default function AddProductPage() {
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [stock, setStock] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        slug,
        price: Number(price),
        description,
        category,
        image,
        stock: Number(stock),
      }),
    });
    const result = await res.json();
    alert('✅ محصول اضافه شد');
    setTitle('');
    setSlug('');
    setPrice('');
    setDescription('');
    setCategory('');
    setImage('');
    setStock('');
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold text-green-700">➕ افزودن محصول جدید</h1>

      <div className="bg-white shadow p-4 rounded space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="عنوان محصول"
          className="border w-full px-4 py-2 rounded"
        />
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="نامک (slug)"
          className="border w-full px-4 py-2 rounded"
        />
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="قیمت (تومان)"
          type="number"
          className="border w-full px-4 py-2 rounded"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="توضیحات محصول"
          rows={4}
          className="border w-full px-4 py-2 rounded"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border w-full px-4 py-2 rounded"
        >
          <option value="">انتخاب دسته‌بندی</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.title}
            </option>
          ))}
        </select>
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="آدرس تصویر"
          className="border w-full px-4 py-2 rounded"
        />
        <input
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="موجودی"
          type="number"
          className="border w-full px-4 py-2 rounded"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? 'در حال افزودن...' : 'افزودن محصول'}
        </button>
      </div>
    </div>
  );
}