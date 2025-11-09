import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import jsPDF from 'jspdf';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    fetch('/api/orders') // مطمئن شو این API وجود داره
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setFilteredOrders(data);
      });
  }, []);

  // محاسبه مجموع فروش
  const totalSales = filteredOrders.reduce((sum, order) => sum + order.total, 0);

  // خروجی CSV
  const exportCSV = () => {
    const csv = Papa.unparse(
      filteredOrders.map((o) => ({
        شناسه: o._id,
        نام: o.customer.name,
        تلفن: o.customer.phone,
        آدرس: o.customer.address,
        تاریخ: new Date(o.date).toLocaleString('fa-IR'),
        مبلغ: o.total,
        وضعیت: o.status,
      }))
    );
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'orders-report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // خروجی PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFont('Helvetica');
    doc.setFontSize(12);
    doc.text('گزارش سفارش‌ها', 15, 20);

    let y = 30;
    filteredOrders.forEach((o) => {
      doc.text(`سفارش #${o._id}`, 15, y); y += 6;
      doc.text(`نام: ${o.customer.name}`, 15, y); y += 6;
      doc.text(`تلفن: ${o.customer.phone}`, 15, y); y += 6;
      doc.text(`آدرس: ${o.customer.address}`, 15, y); y += 6;
      doc.text(`تاریخ: ${new Date(o.date).toLocaleString('fa-IR')}`, 15, y); y += 6;
      doc.text(`مبلغ: ${o.total.toLocaleString()} تومان`, 15, y); y += 6;
      doc.text(`وضعیت: ${o.status}`, 15, y); y += 10;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save('orders-report.pdf');
  };

  // ارسال گزارش به ایمیل
  const sendReportByEmail = async () => {
    const csv = Papa.unparse(
      filteredOrders.map((o) => ({
        شناسه: o._id,
        نام: o.customer.name,
        تلفن: o.customer.phone,
        آدرس: o.customer.address,
        تاریخ: new Date(o.date).toLocaleString('fa-IR'),
        مبلغ: o.total,
        وضعیت: o.status,
      }))
    );

    const res = await fetch('/api/send-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        csvText: csv,
        toEmail: 'recipient@example.ir', // ← ایمیل مقصد رو اینجا بذار
      }),
    });

    const result = await res.json();
    alert(result.message);
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <h1 className="text-2xl font-bold text-red-600">📦 سفارش‌ها</h1>

      {/* مجموع فروش و دکمه‌های خروجی */}
      <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
        <div className="text-lg font-semibold text-green-700">
          مجموع فروش در این فیلتر: {totalSales.toLocaleString()} تومان
        </div>

        <div className="flex gap-3">
          <button
            onClick={exportCSV}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            دانلود گزارش CSV
          </button>
          <button
            onClick={exportPDF}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            دانلود PDF
          </button>
          <button
            onClick={sendReportByEmail}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            ارسال گزارش به ایمیل
          </button>
        </div>
      </div>

      {/* جدول سفارش‌ها */}
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">شناسه</th>
            <th className="border p-2">نام</th>
            <th className="border p-2">تلفن</th>
            <th className="border p-2">تاریخ</th>
            <th className="border p-2">مبلغ</th>
            <th className="border p-2">وضعیت</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((o) => (
            <tr key={o._id}>
              <td className="border p-2">{o._id}</td>
              <td className="border p-2">{o.customer.name}</td>
              <td className="border p-2">{o.customer.phone}</td>
              <td className="border p-2">{new Date(o.date).toLocaleDateString('fa-IR')}</td>
              <td className="border p-2">{o.total.toLocaleString()} تومان</td>
              <td className="border p-2">{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}