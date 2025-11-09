import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* بنر برند */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">فروشگاه آیدانا</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          تجربه‌ای متفاوت از خرید آنلاین پوشاک، با طراحی حرفه‌ای و تحلیل‌های هوشمند
        </p>
        <Link href="/products">
          <span className="inline-block mt-6 bg-white text-purple-700 font-semibold px-6 py-2 rounded hover:bg-purple-100 cursor-pointer">
            مشاهده محصولات
          </span>
        </Link>
      </section>

      {/* معرفی کوتاه */}
      <section className="max-w-4xl mx-auto py-16 px-6 text-center space-y-6">
        <h2 className="text-2xl font-bold text-purple-700">چرا آیدانا؟</h2>
        <p className="text-gray-600 leading-relaxed">
          ما با تمرکز بر طراحی مینیمال، کیفیت بالا، و تحلیل فروش، فروشگاهی ساخته‌ایم که هم زیباست و هم هوشمند.
          هر محصول با دقت انتخاب شده و هر تصمیم با داده پشتیبانی می‌شود.
        </p>
      </section>

      {/* لینک‌های سریع */}
      <section className="max-w-4xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <Link href="/products">
          <div className="border rounded-lg p-6 hover:shadow-md cursor-pointer">
            <h3 className="text-lg font-semibold text-purple-600">🛍️ همه محصولات</h3>
            <p className="text-sm text-gray-500 mt-2">مرور کامل پوشاک موجود در فروشگاه</p>
          </div>
        </Link>
        <Link href="/categories">
          <div className="border rounded-lg p-6 hover:shadow-md cursor-pointer">
            <h3 className="text-lg font-semibold text-purple-600">📂 دسته‌بندی‌ها</h3>
            <p className="text-sm text-gray-500 mt-2">مرتب‌سازی بر اساس نوع، فصل یا جنس</p>
          </div>
        </Link>
        <Link href="/dashboard">
          <div className="border rounded-lg p-6 hover:shadow-md cursor-pointer">
            <h3 className="text-lg font-semibold text-purple-600">📊 داشبورد فروش</h3>
            <p className="text-sm text-gray-500 mt-2">تحلیل فروش، عملکرد محصولات و گزارش‌ها</p>
          </div>
        </Link>
      </section>
    </div>
  );
}