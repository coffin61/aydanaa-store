// pages/invoice/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function InvoicePage() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!id) return;
    const stored = JSON.parse(localStorage.getItem('orders') || '[]');
    const found = stored.find((o) => o.id === id);
    setOrder(found);
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (!order) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>سفارشی با این شناسه یافت نشد.</p>
        <Link href="/admin/orders">
          <span className="text-purple-600 underline cursor-pointer">← بازگشت به سفارش‌ها</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 border rounded shadow-sm bg-white print:border-none print:shadow-none print:p-0">
      <div className="flex justify-between items-center mb-4 print:hidden">
        <h1 className="text-2xl font-bold">🧾 فاکتور سفارش</h1>
        <div className="flex gap-4">
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            چاپ فاکتور
          </button>
          <a
            href={`/api/invoice/${order.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-700 text-white px-4 py-1 rounded hover:bg-gray-800"
          >
            دانلود PDF
          </a>
        </div>
      </div>

      <div className="text-sm text-gray-700 space-y-1 mb-6">
        <p><strong>شماره سفارش:</strong> {order.id}</p>
        <p><strong>تاریخ ثبت:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>وضعیت:</strong> {order.status}</p>
      </div>

      <table className="w-full border text-sm mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-right">محصول</th>
            <th className="p-2 text-center">تعداد</th>
            <th className="p-2 text-center">قیمت واحد</th>
            <th className="p-2 text-left">جمع</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-2 text-right">{item.title}</td>
              <td className="p-2 text-center">{item.quantity}</td>
              <td className="p-2 text-center">{item.price.toLocaleString()} تومان</td>
              <td className="p-2 text-left">
                {(item.price * item.quantity).toLocaleString()} تومان
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right text-lg font-bold text-blue-700">
        مجموع کل: {order.total.toLocaleString()} تومان
      </div>

      <div className="mt-6 print:hidden">
        <Link href="/admin/orders">
          <span className="text-purple-600 underline cursor-pointer">← بازگشت به سفارش‌ها</span>
        </Link>
      </div>
    </div>
  );
}