// pages/email-log.js
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function EmailLogPage() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [domainFilter, setDomainFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    const storedLogs = JSON.parse(localStorage.getItem('emailLogs') || '[]');
    setLogs(storedLogs);
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.email.toLowerCase().includes(search.toLowerCase()) ||
      log.orderId.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter ? log.status === statusFilter : true;
    const matchesDomain = domainFilter
      ? log.email.toLowerCase().endsWith(domainFilter.toLowerCase())
      : true;

    const sentDate = new Date(log.sentAt);
    const matchesDateFrom = dateFrom ? sentDate >= new Date(dateFrom) : true;
    const matchesDateTo = dateTo ? sentDate <= new Date(dateTo) : true;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesDomain &&
      matchesDateFrom &&
      matchesDateTo
    );
  });

  const uniqueDomains = [...new Set(logs.map((log) => log.email.split('@')[1]))];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-700">📬 لاگ ایمیل‌های ارسال‌شده</h1>

      {/* فیلترها */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="جستجو ایمیل یا شماره سفارش"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="">همه وضعیت‌ها</option>
          <option value="موفق">موفق</option>
          <option value="ارسال مجدد موفق">ارسال مجدد موفق</option>
          <option value="ناموفق">ناموفق</option>
        </select>

        <select
          value={domainFilter}
          onChange={(e) => setDomainFilter(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="">همه دامنه‌ها</option>
          {uniqueDomains.map((domain) => (
            <option key={domain} value={domain}>
              {domain}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border px-2 py-2 rounded w-full"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border px-2 py-2 rounded w-full"
          />
        </div>
      </div>

      {/* جدول لاگ‌ها */}
      {filteredLogs.length === 0 ? (
        <p className="text-gray-500 mt-4">هیچ لاگی با این فیلترها یافت نشد.</p>
      ) : (
        <table className="w-full border text-sm mt-6">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">شماره سفارش</th>
              <th className="border p-2">گیرنده</th>
              <th className="border p-2">تاریخ ارسال</th>
              <th className="border p-2">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id}>
                <td className="border p-2 font-mono">{log.orderId}</td>
                <td className="border p-2">{log.email}</td>
                <td className="border p-2">
                  {new Date(log.sentAt).toLocaleString('fa-IR')}
                </td>
                <td className="border p-2 text-green-700">{log.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}