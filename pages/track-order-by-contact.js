// pages/track-order-by-contact.js
import { useState } from 'react';
import Link from 'next/link';

export default function TrackByContactPage() {
  const [contact, setContact] = useState('');
  const [orders, setOrders] = useState([]);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = () => {
    const stored = JSON.parse(localStorage.getItem('orders') || '[]');
    const matched = stored.filter((o) =>
      o.customerEmail === contact.trim() || o.customerPhone === contact.trim()
    );

    if (matched.length > 0) {
      setOrders(matched);
      setNotFound(false);
    } else {
      setOrders([]);
      setNotFound(true);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📱 پیگیری سفارش با ایمیل یا موبایل</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="ایمیل یا شماره موبایل"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="flex-1 border px-4 py-2 rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          جستجو
        </button>
      </div>

      {notFound && (
        <p className="text-red-600 text-sm mb-4">هیچ سفارشی با این اطلاعات یافت نشد.</p>
      )}

      {orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border rounded p-4 bg-white shadow-sm space-y-1">
              <p><strong>شماره سفارش:</strong> {order.id}</p>
              <p><strong>تاریخ:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>وضعیت:</strong> {order.status}</p>
              <p><strong>مبلغ:</strong> {order.total.toLocaleString()} تومان</p>
              <Link href={`/invoice/${order.id}`}>
                <span className="text-blue-600 underline cursor-pointer text-sm">مشاهده فاکتور</span>
              </Link>
              <a
                href={`/api/invoice/${order.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 underline text-sm block"
              >
                دانلود PDF
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}