// pages/track-order.js
import { useState } from 'react';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = () => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const found = allOrders.find((o) => o.id === orderId.trim());
    if (found) {
      setOrder(found);
      setNotFound(false);
    } else {
      setOrder(null);
      setNotFound(true);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">🔎 پیگیری سفارش</h1>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="شماره سفارش را وارد کنید"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
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
        <p className="text-red-600 text-sm">سفارشی با این شماره پیدا نشد.</p>
      )}

      {order && (
        <div className="border p-4 rounded shadow-sm space-y-4">
          <div>شماره سفارش: <span className="font-mono">{order.id}</span></div>
          <div>تاریخ ثبت: {new Date(order.createdAt).toLocaleDateString('fa-IR')}</div>
          <div>وضعیت: <span className="text-blue-600">{order.status}</span></div>
          <div>مبلغ کل: {order.total.toLocaleString()} تومان</div>

          <div>
            <h2 className="text-lg font-semibold mb-2">🧾 آیتم‌ها:</h2>
            <ul className="divide-y">
              {order.items.map((item, index) => (
                <li key={index} className="py-2 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × {item.price.toLocaleString()} تومان
                    </p>
                  </div>
                  <p className="text-green-700 font-bold">
                    {(item.price * item.quantity).toLocaleString()} تومان
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}