import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function EditProductPage() {
  const router = useRouter();
  const { id } = router.query;

  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  useEffect(() => {
    if (id) {
      fetch(`/api/products/${id}`)
        .then((res) => res.json())
        .then((data) => setProduct(data));
    }
  }, [id]);

  const handleUpdate = async () => {
    setLoading(true);
    const res = await fetch(`/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    const updated = await res.json();
    alert('✅ محصول ویرایش شد');
    setProduct(updated);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm('آیا مطمئنی که می‌خوای این محصول حذف بشه؟')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    alert('🗑 محصول حذف شد');
    router.push('/admin/products');
  };

  if (!product) return <p className="p-8">در حال بارگذاری محصول...</p>;

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold text-yellow-700">✏️ ویرایش محصول</h1>

      <div className="bg-white shadow p-4 rounded space-y-4">
        <input
          value={product.title}
          onChange={(e) => setProduct({ ...product, title: e.target.value })}
          placeholder="عنوان محصول"
          className="border w-full px-4 py-2 rounded"
        />
        <input
          value={product.slug}
          onChange={(e) => setProduct({ ...product, slug: e.target.value })}
          placeholder="نامک (slug)"
          className="border w-full px-4 py-2 rounded"
        />
        <input
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
          placeholder="قیمت"
          type="number"
          className="border w-full px-4 py-2 rounded"
        />
        <textarea
          value={product.description}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
          placeholder="توضیحات"
          rows={4}
          className="border w-full px-4 py-2 rounded"
        />
        <select
          value={product.category?._id || ''}
          onChange={(e) => setProduct({ ...product, category: e.target.value })}
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
          value={product.image}
          onChange={(e) => setProduct({ ...product, image: e.target.value })}
          placeholder="آدرس تصویر"
          className="border w-full px-4 py-2 rounded"
        />
        <input
          value={product.stock}
          onChange={(e) => setProduct({ ...product, stock: Number(e.target.value) })}
          placeholder="موجودی"
          type="number"
          className="border w-full px-4 py-2 rounded"
        />

        <div className="flex gap-4">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            {loading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            🗑 حذف محصول
          </button>
        </div>
      </div>
    </div>
  );
}