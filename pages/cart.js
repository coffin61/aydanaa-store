import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    decreaseQuantity,
  } = useCart();

  const total = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold text-purple-700">🛒 سبد خرید</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">سبد خرید شما خالی است.</p>
      ) : (
        <>
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">تصویر</th>
                <th className="border p-2">محصول</th>
                <th className="border p-2">قیمت</th>
                <th className="border p-2">تعداد</th>
                <th className="border p-2">جمع</th>
                <th className="border p-2">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((p) => (
                <tr key={p._id + p.selectedColor + p.selectedSize}>
                  <td className="border p-2">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-14 h-14 object-cover rounded"
                    />
                  </td>
                  <td className="border p-2">
                    <Link href={`/products/${p._id}`}>
                      <span className="text-blue-600 hover:underline cursor-pointer">
                        {p.title}
                      </span>
                    </Link>
                    <p className="text-xs text-gray-500">
                      رنگ: {p.selectedColor} | سایز: {p.selectedSize}
                    </p>
                  </td>
                  <td className="border p-2">{p.price.toLocaleString()}</td>
                  <td className="border p-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decreaseQuantity(p._id)}
                        className="text-gray-600 text-sm hover:text-blue-600"
                      >
                        ➖
                      </button>
                      <span>{p.quantity}</span>
                      <button
                        onClick={() => addToCart(p)}
                        className="text-gray-600 text-sm hover:text-blue-600"
                      >
                        ➕
                      </button>
                    </div>
                  </td>
                  <td className="border p-2">
                    {(p.price * p.quantity).toLocaleString()}
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => removeFromCart(p._id)}
                      className="text-red-600 hover:underline"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right text-lg font-bold text-green-700">
            مجموع کل: {total.toLocaleString()} تومان
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <Link href="/checkout">
              <span className="flex-1 text-center bg-green-600 text-white py-2 rounded hover:bg-green-700 cursor-pointer">
                ادامه پرداخت
              </span>
            </Link>

            <Link href="/products">
              <span className="flex-1 text-center border border-gray-400 text-gray-700 py-2 rounded hover:bg-gray-100 cursor-pointer">
                🛍️ ادامه خرید
              </span>
            </Link>

            <button
              onClick={clearCart}
              className="flex-1 text-center border border-red-400 text-red-600 py-2 rounded hover:bg-red-50 cursor-pointer"
            >
              🧹 خالی کردن سبد
            </button>
          </div>
        </>
      )}
    </div>
  );
}