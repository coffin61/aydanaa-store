// pages/admin/products/form.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const mockCategories = [
  { id: 1, name: 'سرامیک / گلدان' },
  { id: 2, name: 'شمع دست‌ساز / شمع هفت چاکرا' },
  { id: 3, name: 'زیورآلات / گردنبند' },
];

export default function ProductForm() {
  const router = useRouter();
  const { id } = router.query;
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: '',
    price: '',
    category: '',
    image: null,
    imagePreview: '',
  });

  useEffect(() => {
    if (isEdit) {
      const products = JSON.parse(localStorage.getItem('products') || '[]');
      const product = products.find((p) => p.id === parseInt(id));
      if (product) {
        setForm({
          title: product.title,
          price: product.price,
          category: product.category,
          image: null,
          imagePreview: product.image,
        });
      }
    }
  }, [id]);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('/api/admin/products/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = form.imagePreview;

    if (form.image) {
      imageUrl = await handleImageUpload(form.image);
    }

    const newProduct = {
      id: isEdit ? parseInt(id) : Date.now(),
      title: form.title,
      price: parseInt(form.price),
      category: form.category,
      image: imageUrl,
    };

    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const updated = isEdit
      ? products.map((p) => (p.id === newProduct.id ? newProduct : p))
      : [...products, newProduct];

    localStorage.setItem('products', JSON.stringify(updated));
    router.push('/admin/products');
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">{isEdit ? 'ویرایش محصول' : 'افزودن محصول'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="عنوان محصول"
          className="w-full border p-2 rounded"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="قیمت (تومان)"
          className="w-full border p-2 rounded"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <select
          className="w-full border p-2 rounded"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        >
          <option value="">انتخاب دسته‌بندی</option>
          {mockCategories.map((cat) => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
        />
        {form.imagePreview && (
          <img src={form.imagePreview} className="w-24 h-24 object-cover rounded" />
        )}
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          {isEdit ? 'ذخیره تغییرات' : 'ذخیره محصول'}
        </button>
      </form>
    </div>
  );
}