// pages/admin/dashboard.js
import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(stored);
    setFiltered(stored);
  }, []);

  const handleFilter = () => {
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    const result = orders.filter((order) => {
      const date = new Date(order.createdAt);
      const matchDate = (!from || date >= from) && (!to || date <= to);
      const matchStatus = !selectedStatus || order.status === selectedStatus;
      const matchCategory =
        !selectedCategory ||
        order.items.some((item) => item.category === selectedCategory);

      return matchDate && matchStatus && matchCategory;
    });

    setFiltered(result);
  };

  // 📊 فروش روزانه
  const dailyStats = filtered.reduce((acc, order) => {
    const date = new Date(order.createdAt).toLocaleDateString('fa-IR');
    const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (!acc[date]) acc[date] = 0;
    acc[date] += total;
    return acc;
  }, {});

  const dailyChartData = {
    labels: Object.keys(dailyStats),
    datasets: [
      {
        label: 'مجموع فروش روزانه (تومان)',
        data: Object.values(dailyStats),
        backgroundColor: '#6366f1',
      },
    ],
  };

  // 🥧 سهم دسته‌بندی‌ها
  const categoryStats = {};
  filtered.forEach((order) => {
    order.items.forEach((item) => {
      const total = item.price * item.quantity;
      if (!categoryStats[item.category]) categoryStats[item.category] = 0;
      categoryStats[item.category] += total;
    });
  });

  const pieChartData = {
    labels: Object.keys(categoryStats),
    datasets: [
      {
        label: 'سهم دسته‌بندی‌ها',
        data: Object.values(categoryStats),
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'],
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <h1 className="text-2xl font-bold">📊 داشبورد ترکیبی فروش</h1>

      {/* فیلترها */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-sm mb-1">از تاریخ:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full border px-3 py-1 rounded"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">تا تاریخ:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full border px-3 py-1 rounded"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">وضعیت سفارش:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full border px-3 py-1 rounded"
          >
            <option value="">همه</option>
            <option value="در حال پردازش">در حال پردازش</option>
            <option value="ارسال شده">ارسال شده</option>
            <option value="تحویل داده شده">تحویل داده شده</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">دسته‌بندی محصول:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border px-3 py-1 rounded"
          >
            <option value="">همه دسته‌ها</option>
            <option value="سرامیک">سرامیک</option>
            <option value="کاشی">کاشی</option>
            <option value="لوازم جانبی">لوازم جانبی</option>
            {/* دسته‌های واقعی پروژه رو اینجا بذار */}
          </select>
        </div>
        <div className="md:col-span-3 text-left">
          <button
            onClick={handleFilter}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            اعمال فیلتر
          </button>
        </div>
      </div>

      {/* نمودارها */}
      {filtered.length === 0 ? (
        <p className="text-gray-500">هیچ سفارشی مطابق فیلتر یافت نشد.</p>
      ) : (
        <>
          <div className="bg-white p-4 rounded shadow-sm">
            <h2 className="text-lg font-semibold mb-2">نمودار فروش روزانه</h2>
            <Bar data={dailyChartData} />
          </div>

          <div className="bg-white p-4 rounded shadow-sm">
            <h2 className="text-lg font-semibold mb-2">نمودار سهم دسته‌بندی‌ها</h2>
            <Pie data={pieChartData} />
          </div>
        </>
      )}
    </div>
  );
}