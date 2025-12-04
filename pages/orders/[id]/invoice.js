// pages/orders/[id]/invoice.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function InvoicePage() {
  const router = useRouter();
  const { id } = router.query;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (!res.ok) {
          throw new Error('خطا در دریافت سفارش');
        }
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error('❌ خطا در بارگذاری سفارش:', err);
        setError('سفارش یافت نشد یا خطا در بارگذاری رخ داد.');
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">🧾 فاکتور سفارش</h1>
        <p className="text-gray-500">⏳ در حال بارگذاری...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">🧾 فاکتور سفارش</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">🧾 فاکتور سفارش</h1>
        <p className="text-gray-500">هیچ سفارشی یافت نشد.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">🧾 فاکتور سفارش {order.id}</h1>

      <div className="mb-6">
        <p className="text-gray-700">وضعیت: {order.status || 'نامشخص'}</p>
        <p className="text-gray-700">ایمیل کاربر: {order.userEmail || 'نامشخص'}</p>
        <p className="text-gray-700">تاریخ: {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'نامشخص'}</p>
      </div>

      <ul className="divide-y">
        {Array.isArray(order.items) &&
          order.items.map((item) => (
            <li key={item.id} className="py-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{item.title || 'بدون عنوان'}</p>
                <p className="text-sm text-gray-500">
                  {item.quantity || 0} × {(item.price || 0).toLocaleString()} تومان
                </p>
              </div>
              <p className="text-green-700 font-bold">
                {((item.price || 0) * (item.quantity || 0)).toLocaleString()} تومان
              </p>
            </li>
          ))}
      </ul>

      <div className="mt-6 text-right">
        <p className="text-lg font-bold text-blue-700">
          مجموع: {(order.total || 0).toLocaleString()} تومان
        </p>
      </div>
    </div>
  );
}