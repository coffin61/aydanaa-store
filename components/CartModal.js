import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartModal({ isOpen, onClose }) {
  const {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    decreaseQuantity,
  } = useCart();

  const total = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
        >
          ×
        </button>

        <h2 className="text-lg font-semibold mb-4">🛒 سبد خرید شما</h2>

        {cart.length === 0 ? (
          <p className="text-gray-500">سبد خرید شما خالی است.</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item._id + item.selectedColor + item.selectedSize}
                className="flex items-center gap-4 border-b pb-2"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-gray-500">
                    رنگ: {item.selectedColor} | سایز: {item.selectedSize}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} × {item.price.toLocaleString()} تومان
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => decreaseQuantity(item._id)}
                      className="text-gray-600 text-sm hover:text-blue-600"
                    >
                      ➖
                    </button>
                    <span className="text-sm">{item.quantity}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="text-gray-600 text-sm hover:text-blue-600"
                    >
                      ➕
                    </button>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="text-right font-bold text-green-700">
              مجموع: {total.toLocaleString()} تومان
            </div>

            <Link href="/checkout">
              <span
                onClick={onClose}
                className="block text-center bg-green-600 text-white py-2 rounded hover:bg-green-700 cursor-pointer"
              >
                ادامه پرداخت
              </span>
            </Link>

            <Link href="/products">
              <span
                onClick={onClose}
                className="block text-center border border-gray-400 text-gray-700 py-2 rounded hover:bg-gray-100 cursor-pointer mt-2"
              >
                🛍️ ادامه خرید
              </span>
            </Link>

            <button
              onClick={() => {
                clearCart();
                onClose();
              }}
              className="block w-full text-center border border-red-400 text-red-600 py-2 rounded hover:bg-red-50 cursor-pointer mt-2"
            >
              🧹 خالی کردن سبد
            </button>
          </div>
        )}
      </div>
    </div>
  );
}