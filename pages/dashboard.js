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
} from 'chart.js';
import dayjs from 'dayjs';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [range, setRange] = useState('30d');

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

  const currentTotal = currentOrders.reduce((sum, o) => sum + o.total, 0);
  const previousTotal = previousOrders.reduce((sum, o) => sum + o.total, 0);
  const growth = previousTotal === 0 ? 0 : ((currentTotal - previousTotal) / previousTotal) * 100;

  // فروش روزانه
  const dailySales = {};
  currentOrders.forEach((order) => {
    const date = new Date(order.date).toISOString().split('T')[0];
    dailySales[date] = (dailySales[date] || 0) + order.total;
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

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12">
      <h1 className="text-3xl font-bold text-red-600">📊 داشبورد فروش</h1>

      {/* فیلتر بازه زمانی */}
      <div className="mb-6">
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

      {/* کارت‌های آماری مقایسه‌ای */}
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
                backgroundColor: ['#f87171', '#60a5fa', '#34d399'],
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
    </div>
  );
}