import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (session?.user?.email) {
        try {
          const res = await fetch(`/api/orders?email=${session.user.email}`);
          const data = await res.json();
          if (res.ok) {
            setOrders(data.orders);
          } else {
            setError(data.message || 'خطا در دریافت سفارش‌ها');
          }
        } catch (err) {
          setError('❌ ارتباط با سرور برقرار نشد');
        } finally {
          setLoadingOrders(false);
        }
      }
    };
    fetchOrders();
  }, [session]);

  if (status === 'loading') return <div className="p-8">در حال بارگذاری...</div>;
  if (status === 'unauthenticated') return <div className="p-8">لطفاً ابتدا وارد شوید.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">پروفایل کاربر</h1>
          <p className="text-gray-600 mt-1">
            سلام {session.user.name || 'کاربر'} 👋
            <br />
            ایمیل: {session.user.email}
          </p>
        </div>
        <button
          onClick={() => signOut()}
          className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded"
        >
          خروج از حساب
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-4 text-purple-700">سفارش‌های شما:</h2>

      {loadingOrders ? (
        <p className="text-gray-500">در حال دریافت سفارش‌ها...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">هنوز سفارشی ثبت نکرده‌اید.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border rounded p-4 shadow-sm bg-white">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">
                  تاریخ: {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                </span>
                <span className="text-sm text-gray-600">وضعیت: {order.status}</span>
              </div>
              <div className="text-sm text-gray-700 mb-2">
                مجموع: <span className="font-bold text-purple-600">{order.total.toLocaleString()} تومان</span>
              </div>
              <ul className="text-sm text-gray-600 list-disc pl-5">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.title} — {item.quantity} عدد × {item.price.toLocaleString()} تومان
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}