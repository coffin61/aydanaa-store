import { useEffect, useState } from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import dayjs from 'dayjs';
import Link from 'next/link';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  Title
);

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [range, setRange] = useState('30d');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  const getRangeDate = () => {
    const now = dayjs();
    switch (range) {
      case '7d': return now.subtract(7, 'day');
      case '30d': return now.subtract(30, 'day');
      case '90d': return now.subtract(90, 'day');
      default: return dayjs('2000-01-01');
    }
  };

  if (!stats) return <p className="p-8">در حال بارگذاری داشبورد...</p>;

  const now = dayjs();
  const rangeDate = getRangeDate();
  const prevRangeDate =
    range === '7d' ? now.subtract(14, 'day') :
    range === '30d' ? now.subtract(60, 'day') :
    range === '90d' ? now.subtract(180, 'day') :
    dayjs('2000-01-01');

  const currentOrders = stats.orders.filter((o) =>
    dayjs(o.date).isAfter(rangeDate)
  );
  const previousOrders = stats.orders.filter((o) =>
    dayjs(o.date).isAfter(prevRangeDate) && dayjs(o.date).isBefore(rangeDate)
  );

  const currentTotal = currentOrders.reduce((sum, o) => sum + parseFloat(o.total), 0);
  const previousTotal = previousOrders.reduce((sum, o) => sum + parseFloat(o.total), 0);
  const growth = previousTotal === 0 ? 0 : ((currentTotal - previousTotal) / previousTotal) * 100;

  // فروش روزانه
  const dailySales = {};
  currentOrders.forEach((order) => {
    const date = new Date(order.date).toISOString().split('T')[0];
    dailySales[date] = (dailySales[date] || 0) + parseFloat(order.total);
  });
  const dailyLabels = Object.keys(dailySales);
  const dailyValues = Object.values(dailySales);

  // وضعیت سفارش‌ها
  const statusCounts = {};
  currentOrders.forEach((order) => {
    statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
  });
  const statusLabels = Object.keys(statusCounts);
  const statusValues = Object.values(statusCounts);

  // محصولات پرفروش
  const productCounts = {};
  currentOrders.forEach((order) => {
    order.items.forEach((item) => {
      productCounts[item.title] = (productCounts[item.title] || 0) + item.quantity;
    });
  });
  const productLabels = Object.keys(productCounts);
  const productValues = Object.values(productCounts);

  // فیلتر و جستجو روی سفارش‌ها
  const filteredOrders = currentOrders.filter((order) => {
    const matchesSearch =
      order.id.toString().includes(search) ||
      order.status.toLowerCase().includes(search.toLowerCase()) ||
      order.items.some((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );

    const matchesStatus =
      statusFilter === 'all' ? true : order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12">
      <h1 className="text-3xl font-bold text-red-600">📊 داشبورد فروش</h1>

      {/* فیلتر بازه زمانی + جستجو + وضعیت */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div>
          <label className="block mb-2 font-medium">بازه زمانی:</label>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="border px-4 py-2 rounded"
          >
            <option value="7d">۷ روز گذشته</option>
            <option value="30d">۳۰ روز گذشته</option>
            <option value="90d">۹۰ روز گذشته</option>
            <option value="all">همه سفارش‌ها</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">جستجو:</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="شناسه، وضعیت یا محصول..."
            className="border px-4 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">فیلتر وضعیت:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-4 py-2 rounded"
          >
            <option value="all">همه</option>
            <option value="pending">در انتظار</option>
            <option value="paid">پرداخت شده</option>
            <option value="shipped">ارسال شده</option>
            <option value="delivered">تحویل شده</option>
            <option value="canceled">لغو شده</option>
          </select>
        </div>
      </div>

      {/* کارت‌های آماری */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow p-4 rounded">
          <h3 className="text-sm text-gray-500 mb-1">مجموع فروش در بازه فعلی</h3>
          <p className="text-xl font-bold text-green-600">{currentTotal.toLocaleString()} تومان</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h3 className="text-sm text-gray-500 mb-1">مجموع فروش در بازه قبلی</h3>
          <p className="text-xl font-bold text-blue-600">{previousTotal.toLocaleString()} تومان</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h3 className="text-sm text-gray-500 mb-1">درصد تغییر</h3>
          <p className={`text-xl font-bold ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {growth.toFixed(1)}٪
          </p>
        </div>
      </div>

      {/* نمودار فروش روزانه */}
      <div>
        <h2 className="text-xl font-semibold mb-4">فروش روزانه</h2>
        <Line
          data={{
            labels: dailyLabels,
            datasets: [
              {
                label: 'تومان',
                data: dailyValues,
                borderColor: 'blue',
                backgroundColor: 'rgba(0,0,255,0.1)',
              },
            ],
          }}
        />
      </div>

      {/* نمودار وضعیت سفارش‌ها */}
      <div>
        <h2 className="text-xl font-semibold mb-4">وضعیت سفارش‌ها</h2>
        <Pie
          data={{
            labels: statusLabels,
            datasets: [
              {
                data: statusValues,
                backgroundColor: ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#9ca3af'],
              },
            ],
          }}
        />
      </div>

      {/* نمودار محصولات پرفروش */}
      <div>
        <h2 className="text-xl font-semibold mb-4">محصولات پرفروش</h2>
        <Bar
          data={{
            labels: productLabels,
            datasets: [
              {
                label: 'تعداد فروش',
                data: productValues,
                backgroundColor: '#fbbf24',
              },
            ],
          }}
        />
      </div>

      {/* لیست سفارش‌ها با فیلتر و جستجو */}
      <div>
        <h2 className="text-xl font-semibold mb-4">لیست سفارش‌ها</h2>
        <div className="bg-white shadow rounded p-4 overflow-x-auto">
                    <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">شناسه</th>
                <th className="border px-4 py-2">تاریخ</th>
                <th className="border px-4 py-2">وضعیت</th>
                <th className="border px-4 py-2">مجموع</th>
                <th className="border px-4 py-2">آیتم‌ها</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">
                    <Link href={`/orders/${order.id}`} className="text-blue-600 hover:underline">
                      {order.id}
                    </Link>
                  </td>
                  <td className="border px-4 py-2">
                    {dayjs(order.date).format('YYYY-MM-DD HH:mm')}
                  </td>
                  <td className="border px-4 py-2">{order.status}</td>
                  <td className="border px-4 py-2">
                    {parseFloat(order.total).toLocaleString()} تومان
                  </td>
                  <td className="border px-4 py-2">
                    <ul className="list-disc list-inside">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.title} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-4">
                    هیچ سفارشی مطابق فیلتر و جستجو یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}