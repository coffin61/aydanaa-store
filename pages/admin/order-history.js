{stats && (
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
          y: { title: { display: true, text: 'تعداد تغییرات' }, beginAtZero: true },
        },
      }}
    />
  </div>
)}