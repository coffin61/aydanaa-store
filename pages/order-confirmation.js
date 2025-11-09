import Link from 'next/link';

export default function OrderConfirmation() {
  return (
    <div className="max-w-xl mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">سفارش شما ثبت شد ✅</h1>
      <p className="text-gray-700 mb-6">
        از خرید شما سپاسگزاریم! سفارش شما در حال پردازش است و به‌زودی ارسال خواهد شد.
      </p>
      <Link href="/shop">
        <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
          بازگشت به فروشگاه
        </button>
      </Link>
    </div>
  );
}