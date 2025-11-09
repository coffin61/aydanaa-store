import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Header() {
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []));
  }, []);

  const isActive = (href) => router.pathname === href;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* لوگو برند */}
        <Link href="/">
          <span className="text-xl font-bold text-gray-800 tracking-tight cursor-pointer">
            Aydanaa
          </span>
        </Link>

        {/* منوی دسکتاپ */}
        <nav className="hidden lg:flex gap-6 text-sm font-medium">
          <Link href="/">
            <span className={`cursor-pointer ${isActive('/') ? 'text-purple-600 font-semibold' : 'text-gray-700 hover:text-purple-600'}`}>
              صفحه نخست
            </span>
          </Link>

          {/* منوی کشویی دسته‌ها */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-gray-700 hover:text-purple-600 cursor-pointer"
            >
              دسته‌بندی‌ها ▾
            </button>
            {dropdownOpen && (
              <div className="absolute top-full right-0 mt-2 bg-white border rounded shadow-lg w-48 z-50">
                {categories.map((cat) => (
                  <Link key={cat._id} href={`/categories/${cat.slug}`}>
                    <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 cursor-pointer">
                      {cat.title}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/training">
            <span className={`cursor-pointer ${isActive('/training') ? 'text-purple-600 font-semibold' : 'text-gray-700 hover:text-purple-600'}`}>
              آموزش
            </span>
          </Link>
          <Link href="/about">
            <span className={`cursor-pointer ${isActive('/about') ? 'text-purple-600 font-semibold' : 'text-gray-700 hover:text-purple-600'}`}>
              درباره ما
            </span>
          </Link>
          <Link href="/contact">
            <span className={`cursor-pointer ${isActive('/contact') ? 'text-purple-600 font-semibold' : 'text-gray-700 hover:text-purple-600'}`}>
              تماس با ما
            </span>
          </Link>
        </nav>

        {/* آیکون‌ها سمت چپ */}
        <div className="flex items-center gap-4">
          <Link href="/login">
            <span className="text-sm text-gray-700 hover:text-purple-600 cursor-pointer">
              ورود / ثبت‌نام
            </span>
          </Link>

          <Link href="/cart">
            <div className="relative cursor-pointer">
              <span className="text-xl">🛒</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full px-1">
                  {cart.length}
                </span>
              )}
            </div>
          </Link>

          <button
            className="lg:hidden text-xl text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* منوی موبایل بازشونده */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 px-4 py-2 space-y-2">
          <Link href="/">
            <span className="block text-gray-700 hover:text-purple-600 cursor-pointer">صفحه نخست</span>
          </Link>
          <details>
            <summary className="text-gray-700 hover:text-purple-600 cursor-pointer">دسته‌بندی‌ها</summary>
            <div className="pl-4 pt-2 space-y-1">
              {categories.map((cat) => (
                <Link key={cat._id} href={`/categories/${cat.slug}`}>
                  <span className="block text-sm text-gray-700 hover:text-purple-600 cursor-pointer">
                    {cat.title}
                  </span>
                </Link>
              ))}
            </div>
          </details>
          <Link href="/training">
            <span className="block text-gray-700 hover:text-purple-600 cursor-pointer">آموزش</span>
          </Link>
          <Link href="/about">
            <span className="block text-gray-700 hover:text-purple-600 cursor-pointer">درباره ما</span>
          </Link>
          <Link href="/contact">
            <span className="block text-gray-700 hover:text-purple-600 cursor-pointer">تماس با ما</span>
          </Link>
          <Link href="/login">
            <span className="block text-gray-700 hover:text-purple-600 cursor-pointer">ورود / ثبت‌نام</span>
          </Link>
        </div>
      )}
    </header>
  );
}