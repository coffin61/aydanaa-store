import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin-auth') === 'true';
    if (!isAuthenticated) {
      router.push('/admin-login');
    }

    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    setOrders(storedOrders);
  }, []);

  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const statusCounts = {
    'در حال پردازش': 0,
    'ارسال شده': 0,
    'تحویل داده شده': 0,
  };

  orders.forEach((order) => {
    const status = order.status || 'در حال پردازش';
    statusCounts[status] += 1;
  });

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">داشبورد مدیریت</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold mb-2">تعداد کل سفارش‌ها</h2>
          <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold mb-2">مجموع فروش</h2>
          <p className="text-2xl font-bold text-green-600">{totalSales.toLocaleString()} تومان</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold mb-2">در حال پردازش</h2>
          <p className="text-2xl font-bold text-orange-500">{statusCounts['در حال پردازش']}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold mb-2">ارسال شده</h2>
          <p className="text-2xl font-bold text-blue-500">{statusCounts['ارسال شده']}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold mb-2">تحویل داده شده</h2>
          <p className="text-2xl font-bold text-green-700">{statusCounts['تحویل داده شده']}</p>
        </div>
      </div>
    </div>
  );
}