import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { Authority, Status, order } = router.query;

  const [message, setMessage] = useState('در حال بررسی پرداخت...');
  const [loading, setLoading] = useState(true);
  const [refId, setRefId] = useState('');

  useEffect(() => {
    if (Status === 'OK' && Authority && order) {
      fetch('/api/zarinpal/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authority: Authority,
          amount: 10000, // 🔁 این مقدار باید با مبلغ واقعی سفارش هماهنگ باشه
          orderId: order,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code === 100) {
            setMessage('✅ پرداخت با موفقیت انجام شد');
            setRefId(data.ref_id);

            // ارسال پیام تأیید (اختیاری)
            fetch('/api/notify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                phone: '09123456789', // 🔁 شماره مشتری واقعی از دیتابیس
                message: `سفارش شما با موفقیت ثبت شد. کد پیگیری: ${data.ref_id}`,
              }),
            });
          } else {
            setMessage('❌ پرداخت ناموفق بود');
          }
          setLoading(false);
        })
        .catch(() => {
          setMessage('❌ خطا در بررسی پرداخت');
          setLoading(false);
        });
    } else if (Status === 'NOK') {
      setMessage('❌ پرداخت توسط کاربر لغو شد');
      setLoading(false);
    }
  }, [Authority, Status, order]);

  return (
    <div className="max-w-xl mx-auto p-8 text-center space-y-6">
      <h1 className="text-2xl font-bold text-purple-700">نتیجه پرداخت</h1>
      <p className="text-lg text-gray-700">{loading ? '⏳ لطفاً صبر کنید...' : message}</p>
      {!loading && refId && (
        <p className="text-green-700 font-semibold">کد پیگیری: {refId}</p>
      )}
      {!loading && (
        <a href="/" className="text-blue-600 hover:underline">
          بازگشت به صفحه اصلی
        </a>
      )}
    </div>
  );
}