import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Bar } from 'react-chartjs-2';
import dayjs from 'dayjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminPanel() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [range, setRange] = useState('1m');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin-auth') === 'true';
    if (!isAuthenticated) {
      router.push('/admin-login');
      return;
    }

    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error('خطا در دریافت سفارش‌ها:', err));
  }, []);

  const handleDeleteOrder = async (id) => {
    await fetch('/api/orders', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const handleStatusChange = async (id, newStatus) => {
    await fetch('/api/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  const getRangeDate = () => {
    const now = dayjs();
    switch (range) {
      case '1d': return now.subtract(1, 'day');
      case '1m': return now.subtract(1, 'month');
      case '3m': return now.subtract(3, 'month');
      case '6m': return now.subtract(6, 'month');
      case '9m': return now.subtract(9, 'month');
      case '1y': return now.subtract(1, 'year');
      default: return now.subtract(1, 'month');
    }
  };

  const filteredOrders = orders.filter((order) =>
    dayjs(order.date).isAfter(getRangeDate())
  );

  const dailyStats = {};

  filteredOrders.forEach((order) => {
    const date = dayjs(order.date).format('YYYY-MM-DD');
    if (!dailyStats[date]) {
      dailyStats[date] = { count: 0, products: new Set() };
    }
    order.items.forEach((item) => {
      dailyStats[date].count += item.quantity;
      dailyStats[date].products.add(item.title);
    });
  });

  const chartData = {
    labels: Object.keys(dailyStats),
    datasets: [
      {
        type: 'bar',
        label: 'تعداد کل اجناس',
        data: Object.values(dailyStats).map((d) => d.count),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
      },
      {
        type: 'line',
        label: 'تنوع محصولات',
        data: Object.values(dailyStats).map((d) => d.products.size),
        borderColor: 'orange',
        backgroundColor: 'rgba(255, 165, 0, 0.2)',
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'نمودار ترکیبی فروش روزانه و تنوع محصولات' },
    },
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-red-600">پنل مدیریت فروش</h1>
        <button
          onClick={() => {
            localStorage.removeItem('admin-auth');
            router.push('/admin-login');
          }}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
        >
          خروج مدیر
        </button>
      </div>

      {/* انتخاب بازه زمانی */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">انتخاب بازه زمانی:</label>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="1d">۱ روز گذشته</option>
          <option value="1m">۱ ماه گذشته</option>
          <option value="3m">۳ ماه گذشته</option>
          <option value="6m">۶ ماه گذشته</option>
          <option value="9m">۹ ماه گذشته</option>
          <option value="1y">۱ سال گذشته</option>
        </select>
      </div>

      {/* نمودار ترکیبی */}
      <div className="bg-white shadow rounded p-4 mb-8">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-center text-gray-500">هیچ سفارشی در این بازه ثبت نشده است.</p>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white shadow p-4 rounded">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">سفارش #{order.id}</h2>
                <button
                  onClick={() => handleDeleteOrder(order.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  حذف سفارش
                </button>
              </div>
              <p className="text-gray-700 mb-1">نام: {order.customer.name}</p>
              <p className="text-gray-700 mb-1">تلفن: {order.customer.phone}</p>
              <p className="text-gray-700 mb-1">آدرس: {order.customer.address}</p>
              <p className="text-gray-700 mb-2">تاریخ: {new Date(order.date).toLocaleString('fa-IR')}</p>
              <p className="text-blue-600 font-bold mb-2">جمع کل: {order.total.toLocaleString()} تومان</p>

              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">وضعیت سفارش:</label>
                <select
                  value={order.status || 'در حال پردازش'}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  <option value="در حال پردازش">در حال پردازش</option>
                  <option value="ارسال شده">ارسال شده</option>
                  <option value="تحویل داده شده">تحویل داده شده</option>
                </select>
              </div>

              <div className="border-t pt-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{item.title} × {item.quantity}</span>
                    <span>{(item.price * item.quantity).toLocaleString()} تومان</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}