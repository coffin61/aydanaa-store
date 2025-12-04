// pages/admin/users.js
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });

  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(setUsers);
  }, []);

  if (!session) return <div className="p-6">⛔ لطفاً وارد شوید.</div>;
  if (session.user.role !== 'admin') return <div className="p-6 text-red-600">⛔ فقط ادمین دسترسی دارد.</div>;

  const addUser = async () => {
    const res = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) {
      toast.success('کاربر اضافه شد');
      const { id } = await res.json();
      setUsers([{ id, name: form.name, email: form.email, role: form.role }, ...users]);
      setForm({ name: '', email: '', password: '', role: 'user' });
    } else {
      const data = await res.json();
      toast.error(data.error || 'خطا در افزودن کاربر');
    }
  };

  const updateRole = async (id, role) => {
    const res = await fetch(`/api/users/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role }) });
    if (res.ok) {
      toast.success('نقش بروزرسانی شد');
      setUsers(users.map(u => (u.id === id ? { ...u, role } : u)));
    } else {
      toast.error('خطا در بروزرسانی نقش');
    }
  };

  const removeUser = async (id) => {
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('کاربر حذف شد');
      setUsers(users.filter(u => u.id !== id));
    } else {
      toast.error('خطا در حذف کاربر');
    }
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">مدیریت کاربران</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input className="border rounded px-3 py-2" placeholder="نام" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="border rounded px-3 py-2" placeholder="ایمیل" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input className="border rounded px-3 py-2" type="password" placeholder="رمز عبور" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <select className="border rounded px-3 py-2" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
          <option value="user">کاربر</option>
          <option value="operator">اپراتور</option>
          <option value="admin">ادمین</option>
        </select>
      </div>
      <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={addUser}>افزودن کاربر</button>

      <table className="w-full border">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 border">نام</th>
            <th className="p-2 border">ایمیل</th>
            <th className="p-2 border">نقش</th>
            <th className="p-2 border">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td className="p-2 border">{u.name}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">
                <select value={u.role} onChange={e => updateRole(u.id, e.target.value)} className="border rounded px-2 py-1">
                  <option value="user">کاربر</option>
                  <option value="operator">اپراتور</option>
                  <option value="admin">ادمین</option>
                </select>
              </td>
              <td className="p-2 border">
                <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => removeUser(u.id)}>حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}