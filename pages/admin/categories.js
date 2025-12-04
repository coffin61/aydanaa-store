// pages/admin/categories.js
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function CategoriesPage() {
  const { data: session } = useSession();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories);
  }, []);

  if (!session || session.user.role !== 'admin') return <div className="p-6 text-red-600">⛔ دسترسی محدود</div>;

  const addCategory = async () => {
    const res = await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
    if (res.ok) {
      const cat = await res.json();
      setCategories([cat, ...categories]);
      setName('');
      toast.success('دسته‌بندی اضافه شد');
    } else {
      toast.error('خطا در افزودن');
    }
  };

  const remove = async (id) => {
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setCategories(categories.filter(c => c.id !== id));
      toast.success('حذف شد');
    } else {
      toast.error('خطا در حذف');
    }
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">مدیریت دسته‌بندی‌ها</h1>
      <div className="flex gap-3">
        <input className="border rounded px-3 py-2" placeholder="نام دسته" value={name} onChange={e => setName(e.target.value)} />
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={addCategory}>افزودن</button>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 border">نام</th>
            <th className="p-2 border">اسلاگ</th>
            <th className="p-2 border">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(c => (
            <tr key={c.id}>
              <td className="p-2 border">{c.name}</td>
              <td className="p-2 border">{c.slug}</td>
              <td className="p-2 border">
                <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => remove(c.id)}>حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}