// pages/admin/orders.js
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(stored);
  }, []);

  const updateStatus = (id, newStatus) => {
    const updated = orders.map((order) =>
      order.id === id ? { ...order, status: newStatus } : order
    );
    setOrders(updated);
    localStorage.setItem('orders', JSON.stringify(updated));
    toast.success(`وضعیت سفارش ${id} به "${newStatus}" تغییر کرد`);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">📦 سفارش‌های ثبت‌شده</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">هیچ سفارشی ثبت نشده است.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">شماره سفارش</th>
              <th className="p-2">تاریخ</th>
              <th className="p-2">مبلغ</th>
              <th className="p-2">وضعیت</th>
              <th className="p-2">تغییر وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-2 font-mono text-xs text-gray-700">{order.id}</td>
                <td className="p-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="p-2 text-green-700 font-bold">{order.total.toLocaleString()} تومان</td>
                <td className="p-2">{order.status}</td>
                <td className="p-2">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option>در حال پردازش</option>
                    <option>ارسال شده</option>
                    <option>تحویل داده شده</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}