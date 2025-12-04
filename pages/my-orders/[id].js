// pages/my-orders/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

export default function OrderDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!id) return;
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const found = allOrders.find((o) => o.id === id);
    setOrder(found);
  }, [id]);

  const handleDownloadPDF = () => {
    if (!order) return;

    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`فاکتور سفارش #${order.id}`, 15, 20);
    let y = 30;
    doc.text(`تاریخ: ${new Date(order.createdAt).toLocaleString('fa-IR')}`, 15, y); y += 6;
    doc.text(`وضعیت: ${order.status}`, 15, y); y += 6;
    doc.text(`مبلغ کل: ${order.total.toLocaleString()} تومان`, 15, y); y += 10;
    order.items.forEach((item) => {
      doc.text(`${item.title} - ${item.quantity} × ${item.price.toLocaleString()} تومان`, 15, y);
      y += 6;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`invoice-${order.id}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = async () => {
    if (!recipientEmail || !order) return toast.error('ایمیل را وارد کنید');

    setSending(true);
    try {
      const res = await fetch('/api/send-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order, email: recipientEmail }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success('✅ فاکتور با موفقیت ارسال شد');
        setRecipientEmail('');
      } else {
        toast.error('ارسال ایمیل ناموفق بود');
      }
    } catch (err) {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setSending(false);
    }
  };

  if (!order) {
    return (
      <div className="p-6 text-gray-500">
        سفارش موردنظر پیدا نشد یا هنوز بارگذاری نشده است.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">📄 جزئیات سفارش</h1>

      {/* ناحیه قابل چاپ */}
      <div id="invoice-print" className="border p-4 rounded shadow-sm space-y-2 bg-white">
        <div>شماره سفارش: <span className="font-mono">{order.id}</span></div>
        <div>تاریخ ثبت: {new Date(order.createdAt).toLocaleDateString('fa-IR')}</div>
        <div>وضعیت: <span className="text-blue-600">{order.status}</span></div>
        <div>مجموع: {order.total.toLocaleString()} تومان</div>

        <div>
          <h2 className="text-lg font-semibold mt-4 mb-2">🧾 آیتم‌های سفارش</h2>
          <ul className="divide-y">
            {order.items.map((item, index) => (
              <li key={index} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} × {item.price.toLocaleString()} تومان
                  </p>
                </div>
                <p className="text-green-700 font-bold">
                  {(item.price * item.quantity).toLocaleString()} تومان
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* دکمه‌ها */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleDownloadPDF}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          دانلود فاکتور PDF
        </button>
        <button
          onClick={handlePrint}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          چاپ فاکتور
        </button>
      </div>

      {/* فرم ارسال ایمیل */}
      <div className="mt-8 border-t pt-6 space-y-4">
        <h2 className="text-lg font-semibold">📤 ارسال فاکتور به ایمیل</h2>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="ایمیل گیرنده"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            className="flex-1 border px-4 py-2 rounded"
          />
          <button
            onClick={handleSendEmail}
            disabled={sending}
            className={`px-4 py-2 rounded text-white ${
              sending ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {sending ? 'در حال ارسال...' : 'ارسال فاکتور'}
          </button>
        </div>
      </div>
    </div>
  );
}