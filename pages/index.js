import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('همه');

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  const categories = [...new Set(products.map((p) => p.category?.name))];
  const filtered = selectedCategory === 'همه'
    ? products
    : products.filter((p) => p.category?.name === selectedCategory);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 font-vazirmatn">
      {/* بنر تصویری */}
      <section className="w-full h-[60vh] bg-cover bg-center" style={{ backgroundImage: "url('/banner.jpg')" }}>
        <div className="h-full flex items-center justify-center bg-black/30">
          <h1 className="text-white text-4xl md:text-5xl font-light tracking-wide">
            فروشگاه آیدانا
          </h1>
        </div>
      </section>

      {/* معرفی کوتاه */}
      <section className="max-w-4xl mx-auto py-16 px-6 text-center space-y-6">
        <h2 className="text-2xl font-light">چرا آیدانا؟</h2>
        <p className="text-neutral-600 leading-relaxed">
          طراحی مینیمال، کیفیت بالا، و تحلیل فروش — فروشگاهی زیبا و هوشمند برای انتخاب‌های دقیق.
        </p>
      </section>

      {/* لینک‌های سریع */}
      <section className="max-w-5xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <Link href="/products">
          <div className="border p-6 bg-white hover:shadow-sm cursor-pointer transition">
            <h3 className="text-lg font-light">🛍️ همه محصولات</h3>
            <p className="text-sm text-neutral-500 mt-2">مرور کامل محصولات موجود</p>
          </div>
        </Link>
        <Link href="/categories">
          <div className="border p-6 bg-white hover:shadow-sm cursor-pointer transition">
            <h3 className="text-lg font-light">📂 دسته‌بندی‌ها</h3>
            <p className="text-sm text-neutral-500 mt-2">مرتب‌سازی بر اساس نوع یا جنس</p>
          </div>
        </Link>
        <Link href="/dashboard">
          <div className="border p-6 bg-white hover:shadow-sm cursor-pointer transition">
            <h3 className="text-lg font-light">📊 داشبورد فروش</h3>
            <p className="text-sm text-neutral-500 mt-2">تحلیل عملکرد و گزارش‌ها</p>
          </div>
        </Link>
      </section>

      {/* محصولات */}
      <section id="products" className="p-6 max-w-6xl mx-auto">
        <CategoryFilter
          categories={['همه', ...categories]}
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {filtered.length === 0 && (
            <p className="text-neutral-500 col-span-full">محصولی در این دسته‌بندی وجود ندارد.</p>
          )}
        </div>
      </section>
    </div>
  );
}