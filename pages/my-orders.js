// pages/my-orders.js
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sending, setSending] = useState(false);

  // بارگذاری سفارش‌ها از localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = JSON.parse(localStorage.getItem('orders') || '[]');
      setOrders(Array.isArray(stored) ? stored : []);
    }
  }, []);

  const handleSendEmail = async () => {
    if (!recipientEmail || !selectedOrder) {
      toast.error('ایمیل و سفارش لازم است');
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/send-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: selectedOrder, email: recipientEmail }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success('✅ فاکتور با موفقیت ارسال شد');
        setRecipientEmail('');

        // ذخیره لاگ ایمیل در localStorage
        const logs = JSON.parse(localStorage.getItem('emailLogs') || '[]');
        const newLog = {
          id: Date.now().toString(),
          orderId: selectedOrder.id,
          email: recipientEmail,
          status: 'موفق',
          sentAt: new Date().toISOString(),
        };
        localStorage.setItem('emailLogs', JSON.stringify([newLog, ...logs]));
      } else {
        toast.error('ارسال ایمیل ناموفق بود');
      }
    } catch (err) {
      console.error('❌ خطا در ارسال ایمیل:', err);
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🧾 سفارش‌های من</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">هیچ سفارشی ثبت نشده است.</p>
      ) : (
        <ul className="divide-y mb-6">
          {orders.map((order) => (
            <li key={order.id} className="py-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">شناسه: {order.id}</p>
                <p className="text-sm text-gray-500">
                  مبلغ: {(order.total || 0).toLocaleString()} تومان
                </p>
                <p className="text-sm text-gray-500">وضعیت: {order.status}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(order)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                انتخاب برای ارسال فاکتور
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedOrder && (
        <div className="space-y-4 bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">
            ارسال فاکتور برای سفارش {selectedOrder.id}
          </h2>
          <input
            type="email"
            placeholder="ایمیل گیرنده"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleSendEmail}
            disabled={sending}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {sending ? '⏳ در حال ارسال...' : '📧 ارسال فاکتور'}
          </button>
        </div>
      )}
    </div>
  );
}