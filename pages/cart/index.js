import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { cartItems, removeFromCart } = useCart();

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold text-blue-700">🛒 سبد خرید شما</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">سبد خرید شما خالی است.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between border p-4 rounded shadow"
            >
              <div>
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-green-700 font-bold">
                  {item.price.toLocaleString()} تومان
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-600 hover:text-red-800"
              >
                حذف
              </button>
            </div>
          ))}

          <div className="text-right pt-4">
            <p className="text-xl font-bold text-blue-800">
              مجموع: {totalPrice.toLocaleString()} تومان
            </p>
            <Link href="/checkout">
              <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                ادامه خرید
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}