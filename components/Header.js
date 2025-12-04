// components/Header.js
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Header() {
  const { cart } = useCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery('');
    setOpen(false);
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50 font-vazir">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* لوگو */}
        <Link href="/">
          <span className="text-xl font-light tracking-wide cursor-pointer text-neutral-800">
            آیدانا
          </span>
        </Link>

        {/* دکمه موبایل */}
        <button
          className="md:hidden text-neutral-700 text-sm"
          onClick={() => setOpen(!open)}
        >
          {open ? 'بستن منو' : 'منو'}
        </button>

        {/* منوی دسکتاپ */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-light text-neutral-700">
          <Link href="/products" className="hover:text-black transition">محصولات</Link>
          <Link href="/categories" className="hover:text-black transition">دسته‌بندی‌ها</Link>
          <Link href="/dashboard" className="hover:text-black transition">داشبورد</Link>
          <Link href="/contact" className="hover:text-black transition">تماس با ما</Link>

          {/* نوار جستجو */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="جستجو..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border px-3 py-1 rounded text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-300"
            />
          </form>

          {/* سبد خرید */}
          <Link href="/cart">
            <div className="relative px-3 py-1 border rounded hover:bg-neutral-100 cursor-pointer">
              🛒
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs px-2 py-0.5 rounded-full">
                  {count}
                </span>
              )}
            </div>
          </Link>

          {/* وضعیت ورود */}
          {status === 'loading' ? (
            <span className="text-xs text-neutral-500">در حال بارگذاری...</span>
          ) : session?.user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-700">سلام، {session.user.name}</span>
              <button
                onClick={() => signOut()}
                className="text-xs text-neutral-500 underline hover:text-black"
              >
                خروج
              </button>
            </div>
         