// pages/checkout.js
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import generateOrderId from '../utils/generateOrderId';
import { useSession } from 'next-auth/react';

export default function CheckoutPage() {
  // گرفتن کانتکست به صورت امن
  const cartContext = useCart() || {};
  const cart = cartContext.cart || [];
  const clearCart = cartContext.clearCart || (() => {});

  const [total, setTotal] = useState(0);
  const { data: session } = useSession();

  // محاسبه مجموع قیمت
  useEffect(() => {
    const sum = Array.isArray(cart)
      ? cart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0)
      : 0;
    setTotal(sum);
  }, [cart]);

  const handleCheckout = () => {
    if (!cart || cart.length === 0) {
      toast.error('سبد خرید شما خالی است');
      return;
    }

    const newOrder = {
      id: generateOrderId(),
      items: cart,
      total,
      createdAt: new Date().toISOString(),
      status: 'در حال پردازش',
      userEmail: session?.user?.email || 'guest',
    };

    try {
      const stored = JSON.parse(localStorage.getItem('orders') || '[]');
      localStorage.setItem('orders', JSON.stringify([...stored, newOrder]));
      toast.success(`✅ سفارش ثبت شد: ${newOrder.id}`);
      clearCart();
    } catch (err) {
      console.error('❌ خطا در ذخیره سفارش:', err);
      toast.error('خطا در ذخیره سفارش');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">💳 صفحه پرداخت</h1>

      {!cart || cart.length === 0 ? (
        <p className="text-gray-500">سبد خرید شما خالی است.</p>
      ) : (
        <>
          <ul className="divide-y">
            {cart.map((item) => (
              <li key={item.id} className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{item.title || 'بدون عنوان'}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity || 0} × {(item.price || 0).toLocaleString()} تومان
                  </p>
                </div>
                <p className="text-green-700 font-bold">
                  {((item.price || 0) * (item.quantity || 0)).toLocaleString()} تومان
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-6 text-right">
            <p className="text-lg font-bold text-blue-700">
              مجموع قابل پرداخت: {total.toLocaleString()} تومان
            </p>
            <button
              onClick={handleCheckout}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              نهایی‌سازی سفارش
            </button>
          </div>
        </>
      )}

      <div className="mt-6">
        <Link href="/cart">
          <span className="text-purple-600 underline cursor-pointer">← بازگشت به سبد خرید</span>
        </Link>
      </div>
    </div>
  );
}