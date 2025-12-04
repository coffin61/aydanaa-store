import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  if (!cart || cart.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>سبد خرید خالی است</p>
        <Link href="/products">
          <span className="text-blue-600 underline cursor-pointer">
            ← بازگشت به محصولات
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-light mb-6">🛒 سبد خرید</h1>
      <ul className="space-y-4">
        {cart.map((item) => (
          <li key={item.id} className="flex justify-between items-center border-b pb-2">
            <span>{item.title}</span>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-600 hover:underline"
            >
              حذف
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}