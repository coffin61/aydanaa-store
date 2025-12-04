// components/Footer.js
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-neutral-100 text-neutral-500 text-sm mt-20 border-t">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* برند */}
        <div>
          <h3 className="text-neutral-700 font-semibold text-lg mb-2">فروشگاه آیدانا</h3>
          <p className="leading-relaxed">
            طراحی مینیمال، کیفیت بالا، و تحلیل فروش — انتخابی هوشمند برای خرید آنلاین.
          </p>
        </div>

        {/* لینک‌ها */}
        <div>
          <h4 className="text-neutral-700 font-medium mb-2">لینک‌های مفید</h4>
          <ul className="space-y-2">
            <li><Link href="/products">محصولات</Link></li>
            <li><Link href="/categories">دسته‌بندی‌ها</Link></li>
            <li><Link href="/dashboard">داشبورد فروش</Link></li>
            <li><Link href="/contact">تماس با ما</Link></li>
          </ul>
        </div>

        {/* شبکه‌های اجتماعی */}
        <div>
          <h4 className="text-neutral-700 font-medium mb-2">ما را دنبال کنید</h4>
          <div className="flex gap-4 mt-2">
            <a href="#" className="hover:text-neutral-700">
              <i className="fab fa-instagram text-xl"></i>
            </a>
            <a href="#" className="hover:text-neutral-700">
              <i className="fab fa-telegram text-xl"></i>
            </a>
            <a href="#" className="hover:text-neutral-700">
              <i className="fab fa-whatsapp text-xl"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="text-center py-4 border-t text-xs text-neutral-400">
        © {new Date().getFullYear()} Aydanaa. همه حقوق محفوظ است.
      </div>
    </footer>
  );
}