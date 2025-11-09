import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function AdminProductsPage() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    price: '',
    image: '',
    category: '',
    description: '',
  });
  const [message, setMessage] = useState('');
  const [editId, setEditId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async () => {
    const query = new URLSearchParams();
    if (filterCategory) query.append('category', filterCategory);
    if (searchTerm) query.append('search', searchTerm);

    const res = await fetch(`/api/admin/products?${query.toString()}`);
    const data = await res.json();
    setProducts(data.products || []);
  };

  useEffect(() => {
    if (session?.user?.role === 'admin') fetchProducts();
  }, [session, filterCategory, searchTerm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `/api/admin/products/${editId}` : '/api/admin/products';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: Number(form.price) }),
    });

    const data = await res.json();
    setMessage(data.message);
    if (res.ok) {
      setForm({ title: '', slug: '', price: '', image: '', category: '', description: '' });
      setEditId(null);
      fetchProducts();
    }
  };

  const handleEdit = (p) => {
    setForm({
      title: p.title,
      slug: p.slug,
      price: p.price,
      image: p.image,
      category: p.category,
      description: p.description,
    });
    setEditId(p._id);
    setMessage('🔧 در حال ویرایش محصول');
  };

  const handleDelete = async (id) => {
    if (!confirm('آیا مطمئنی که می‌خوای حذف کنی؟')) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    const data = await res.json();
    setMessage(data.message);
    fetchProducts();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setForm((prev) => ({ ...prev, image: data.url }));
    setMessage('✅ تصویر با موفقیت آپلود شد');
  };

  if (status === 'loading') return <div className="p-8">در حال بارگذاری...</div>;
  if (!session || session.user.role !== 'admin') return <div className="p-8">⛔ فقط مدیران مجاز هستند</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-4">مدیریت محصولات</h1>

      {/* فیلتر و جستجو */}
      <div className="flex gap-4 mb-6">
        <input
          placeholder="جستجو بر اساس عنوان"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">همه دسته‌ها</option>
          <option value="سرامیک">سرامیک</option>
          <option value="چینی">چینی</option>
          <option value="شیشه">شیشه</option>
        </select>
      </div>

      {/* فرم افزودن/ویرایش */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <input placeholder="عنوان" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="border px-3 py-2 rounded" required />
        <input placeholder="اسلاگ" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="border px-3 py-2 rounded" required />
        <input placeholder="قیمت" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border px-3 py-2 rounded" required />
        <input placeholder="دسته‌بندی" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border px-3 py-2 rounded" />
        <input type="file" accept="image/*" onChange={handleImageUpload} className="border px-3 py-2 rounded col-span-2" />
        {form.image && <img src={form.image} alt="preview" className="w-32 h-32 object-cover rounded border col-span-2" />}
        <textarea placeholder="توضیحات" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border px-3 py-2 rounded col-span-2" />
        <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded col-span-2">
          {editId ? 'ذخیره تغییرات' : 'افزودن محصول'}
        </button>
        {message && <p className="text-sm text-purple-700 col-span-2">{message}</p>}
      </form>

      {/* لیست محصولات */}
      <ul className="space-y-2">
        {products.map((p) => (
          <li key={p._id} className="border p-3 rounded bg-white shadow-sm">
            <div className="font-bold">{p.title}</div>
            <div className="text-sm text-gray-600">
              قیمت: {p.price.toLocaleString()} تومان | دسته: {p.category} |{' '}
              <span className={p.inStock ? 'text-green-600' : 'text-red-600'}>
                {p.inStock ? 'موجود' : 'ناموجود'}
              </span>
            </div>
            <div className="mt-2 flex gap-2">
              <button onClick={() => handleEdit(p)} className="text-blue-600 text-sm">ویرایش</button>
              <button onClick={() => handleDelete(p._id)} className="text-red-600 text-sm">حذف</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}