import { useEffect, useState } from 'react';

export default function OrderListPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold text-purple-700">📦 لیست سفارش‌ها</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">هیچ سفارشی ثبت نشده.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">مشتری</th>
              <th className="border p-2">شماره تماس</th>
              <th className="border p-2">مبلغ</th>
              <th className="border p-2">وضعیت</th>
              <th className="border p-2">تعداد آیتم</th>
              <th className="border p-2">زمان ثبت</th>
              <th className="border p-2">جزئیات</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="border p-2">{order.customer?.name}</td>
                <td className="border p-2">{order.customer?.phone}</td>
                <td className="border p-2">{order.total.toLocaleString()} تومان</td>
                <td className="border p-2">{order.status}</td>
                <td className="border p-2">{order.items.length}</td>
                <td className="border p-2">
                  {new Date(order.createdAt).toLocaleString('fa-IR')}
                </td>
                <td className="border p-2">
                  <a
                    href={`/admin/orders/${order._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    مشاهده
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}