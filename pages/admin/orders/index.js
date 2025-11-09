import { useEffect, useState } from 'react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('همه');

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []));
  }, []);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleString('fa-IR');

  const handleStatusChange = async (id, newStatus) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      const updated = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? updated.order : o))
      );
    }
  };

  const filteredOrders =
    filter === 'همه' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold text-blue-700">📦 مدیریت سفارش‌ها</h1>

      <div className="flex gap-4">
        {['همه', 'در انتظار پرداخت', 'پرداخت شده', 'لغو شده'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1 rounded ${
              filter === status ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-gray-600 pt-4">هیچ سفارشی با این وضعیت وجود ندارد.</p>
      ) : (
        <ul className="space-y-4 pt-4">
          {filteredOrders.map((order) => (
            <li key={order._id} className="border p-4 rounded shadow space-y-2">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-gray-800">
                  🧾 سفارش توسط {order.customerName}
                </h2>
                <span className="text-xs text-gray-500">{formatDate(order.createdAt)}</span>
              </div>

              <p className="text-sm text-gray-600">ایمیل: {order.customerEmail}</p>
              <p className="text-sm text-gray-600">وضعیت: {order.status}</p>

              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                className="border p-1 rounded text-sm"
              >
                <option>در انتظار پرداخت</option>
                <option>پرداخت شده</option>
                <option>لغو شده</option>
              </select>

              <ul className="text-sm bg-gray-50 p-2 rounded">
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.title} × {item.quantity} — {item.price * item.quantity} تومان
                  </li>
                ))}
              </ul>

              <p className="font-bold pt-2">💰 مجموع: {order.totalPrice} تومان</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}