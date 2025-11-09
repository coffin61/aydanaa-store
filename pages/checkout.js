import { useState } from 'react';
import { useRouter } from 'next/router';

export default function CheckoutPage() {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState('');
  const router = useRouter();

  // فرض: آیتم‌های سبد خرید از localStorage یا context گرفته می‌شن
  useState(() => {
    const stored = localStorage.getItem('cart');
    if (stored) setCartItems(JSON.parse(stored));
  }, []);

  const calculateTotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName,
        customerEmail,
        items: cartItems.map((item) => ({
          productId: item._id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
        totalPrice: calculateTotal(),
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage('✅ سفارش با موفقیت ثبت شد');
      localStorage.removeItem('cart');
      setTimeout(() => router.push('/thank-you'), 1500);
    } else {
      setMessage(`❌ خطا: ${data.message || 'ثبت سفارش انجام نشد'}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold text-blue-700">🧾 ثبت سفارش</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="نام کامل"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="ایمیل"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">🛒 آیتم‌های سبد خرید</h2>
          {cartItems.length === 0 ? (
            <p className="text-sm text-gray-600">سبد خرید خالی است</p>
          ) : (
            <ul className="space-y-2">
              {cartItems.map((item) => (
                <li key={item._id} className="text-sm">
                  {item.title} × {item.quantity} — {item.price * item.quantity} تومان
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 font-bold">💰 مجموع: {calculateTotal()} تومان</p>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ثبت سفارش
        </button>
      </form>

      {message && <p className="text-sm text-center pt-4">{message}</p>}
    </div>
  );
}