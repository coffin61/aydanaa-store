// pages/admin/index.js
import { useSession } from 'next-auth/react';

export default function AdminHome() {
  const { data: session } = useSession();
  if (!session) return <div className="p-6">⛔ لطفاً وارد شوید.</div>;
  if (session.user.role !== 'admin') return <div className="p-6 text-red-600">⛔ فقط ادمین دسترسی دارد.</div>;

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">پنل مدیریت آیدانا</h1>
      <ul className="list-disc pl-5">
        <li><a className="text-blue-600" href="/admin/users">مدیریت کاربران</a></li>
        <li><a className="text-blue-600" href="/admin/products">مدیریت محصولات</a></li>
        <li><a className="text-blue-600" href="/admin/categories">مدیریت دسته‌بندی‌ها</a></li>
        <li><a className="text-blue-600" href="/admin/orders">مدیریت سفارش‌ها</a></li>
        <li><a className="text-blue-600" href="/admin/audit">گزارش تغییرات (Audit)</a></li>
      </ul>
    </div>
  );
}