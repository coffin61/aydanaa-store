// pages/admin/order-history.js
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

export default function OrderHistoryPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/orders/history-stats');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('❌ خطا در دریافت آمار:', err);
      }
    }
    fetchStats();
  }, []);

  const handleDownloadCSV = () => {
    if (!stats) return;
    const rows = [['تاریخ', 'مجموع تغییرات', 'تغییر وضعیت', 'تغییر یادداشت']];
    Object.entries(stats).forEach(([date, s]) => {
      rows.push([date, s.total, s.status, s.note]);
    });
    const csvContent = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'order-history-stats.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📊 تاریخچه تغییرات سفارش‌ها</h1>

      {stats ? (
        <div className="bg-white p-4 rounded shadow space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">📈 نمودار تغییرات روزانه</h2>
            <button
              onClick={handleDownloadCSV}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              📥 دانلود خروجی آمار (CSV)
            </button>
          </div>

          <Line
            data={{
              labels: Object.keys(stats),
              datasets: [
                {
                  label: 'مجموع تغییرات',
                  data: Object.values(stats).map((s) => s.total),
                  borderColor: '#6366f1',
                  backgroundColor: '#6366f155',
                  tension: 0.3,
                },
                {
                  label: 'تغییر وضعیت',
                  data: Object.values(stats).map((s) => s.status),
                  borderColor: '#10b981',
                  backgroundColor: '#10b98155',
                  tension: 0.3,
                },
                {
                  label: 'تغییر یادداشت',
                  data: Object.values(stats).map((s) => s.note),
                  borderColor: '#f59e0b',
                  backgroundColor: '#f59e0b55',
                  tension: 0.3,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                tooltip: { mode: 'index', intersect: false },
              },
              scales: {
                x: { title: { display: true, text: 'تاریخ' } },
                y: {
                  title: { display: true, text: 'تعداد تغییرات' },
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      ) : (
        <p>⏳ در حال بارگذاری آمار...</p>
      )}
    </div>
  );
}