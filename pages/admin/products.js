// pages/admin/products.js
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    sku: '',
    price: '',
    category_id: '',
    description: '',
    image_url: '',
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(setProducts);
    fetch('/api/categories').then(r => r.json()).then(setCategories);
  }, []);

  if (!session || session.user.role !== 'admin') {
    return <div className="p-6 text-red-600">⛔ فقط ادمین دسترسی دارد</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? 'PATCH' : 'POST';
    const url = editId ? `/api/admin/products/${editId}` : '/api/products';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: Number(form.price) }),
    });

    if (res.ok) {
      toast.success(editId ? 'محصول بروزرسانی شد' : 'محصول اضافه شد');
      setForm({ name: '', sku: '', price: '', category_id: '', description: '', image_url: '' });
      setEditId(null);
      fetch('/api/products').then(r => r.json()).then(setProducts);
    } else {
      toast.error('خطا در ذخیره محصول');
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      sku: p.sku,
      price: p.price,
      category_id: p.category_id || '',
      description: p.description || '',
      image_url: p.image_url || '',
    });
    setEditId(p.id);
  };

  const handleDelete = async (id) => {
    if (!confirm('آیا مطمئنی؟')) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('محصول حذف شد');
      setProducts(products.filter(p => p.id !== id));
    } else {
      toast.error('خطا در حذف محصول');
    }
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">مدیریت محصولات</h1>

      {/* فرم افزودن/ویرایش */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <input placeholder="نام محصول" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border px-3 py-2 rounded" required />
        <input placeholder="SKU" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} className="border px-3 py-2 rounded" required />
        <input placeholder="قیمت" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="border px-3 py-2 rounded" required />
        <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} className="border px-3 py-2 rounded">
          <option value="">انتخاب دسته‌بندی</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input placeholder="تصویر (URL)" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} className="border px-3 py-2 rounded col-span-2" />
        <textarea placeholder="توضیحات" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="border px-3 py-2 rounded col-span-2" />
        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded col-span-2">
          {editId ? 'ذخیره تغییرات' : 'افزودن محصول'}
        </button>
      </form>

      {/* لیست محصولات */}
      <table className="w-full border">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 border">نام</th>
            <th className="p-2 border">SKU</th>
            <th className="p-2 border">قیمت</th>
            <th className="p-2 border">دسته</th>
            <th className="p-2 border">تصویر</th>
            <th className="p-2 border">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td className="p-2 border">{p.name}</td>
              <td className="p-2 border">{p.sku}</td>
              <td className="p-2 border">{p.price}</td>
              <td className="p-2 border">{p.category || '-'}</td>
              <td className="p-2 border">{p.image_url && <img src={p.image_url} alt="main" className="w-16 h-16 object-cover rounded" />}</td>
              <td className="p-2 border space-x-2">
                <button className="text-blue-600" onClick={() => handleEdit(p)}>ویرایش</button>
                <button className="text-red-600" onClick={() => handleDelete(p.id)}>حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}