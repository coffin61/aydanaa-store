// pages/products.js
import { useEffect, useMemo, useState } from 'react';
import ProductCard from '@/components/ProductCard';

function normalizeProduct(p = {}) {
  return {
    id: p.id ?? `tmp-${Math.random().toString(36).slice(2)}`,
    title: p.title ?? 'بدون عنوان',
    price: typeof p.price === 'number' ? p.price : 0,
    category: p.category ?? 'سایر',
    image: p.image ?? '/placeholder.png',
    ...p,
  };
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState('همه');
  const [sort, setSort] = useState('default');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        let stored = [];
        if (typeof window !== 'undefined') {
          const raw = localStorage.getItem('products');
          const parsed = raw ? JSON.parse(raw) : [];
          stored = Array.isArray(parsed) ? parsed : [];
        }
        if (stored.length > 0) {
          setProducts(stored.map(normalizeProduct));
        } else {
          const res = await fetch('/api/products');
          const data = await res.json();
          const list = Array.isArray(data) ? data : [];
          setProducts(list.map(normalizeProduct));
        }
      } catch (err) {
        console.error('❌ خطا در بارگذاری محصولات:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      const cat = p?.category || 'سایر';
      set.add(cat);
    });
    return Array.from(set);
  }, [products]);

  // فیلتر و مرتب‌سازی امن
  useEffect(() => {
    let result = Array.isArray(products) ? [...products] : [];

    if (category !== 'همه') {
      result = result.filter((p) => (p?.category || 'سایر') === category);
    }

    if (sort === 'price-asc') {
      result.sort((a, b) => (a?.price || 0) - (b?.price || 0));
    } else if (sort === 'price-desc') {
      result.sort((a, b) => (b?.price || 0) - (a?.price || 0));
    } else if (sort === 'title') {
      result.sort((a, b) => (a?.title || '').localeCompare(b?.title || ''));
    }

    setFiltered(result.map(normalizeProduct));
  }, [products, category, sort]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 text-neutral-800 font-vazir px-4 py-10 max-w-6xl mx-auto">
        <h1 className="text-2xl font-light mb-6 text-center">محصولات</h1>
        <p className="text-center text-neutral-500">⏳ در حال بارگذاری محصولات...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 font-vazir px-4 py-10 max-w-6xl mx-auto">
      <h1 className="text-2xl font-light mb-6 text-center">محصولات</h1>

      {/* فیلتر و مرتب‌سازی */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-sm">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="همه">همه دسته‌بندی‌ها</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="default">مرتب‌سازی پیش‌فرض</option>
          <option value="price-asc">ارزان‌ترین</option>
          <option value="price-desc">گران‌ترین</option>
          <option value="title">عنوان</option>
        </select>
      </div>

      {/* نمایش محصولات */}
      {filtered.length === 0 ? (
        <p className="text-neutral-500 text-center">محصولی مطابق فیلترها یافت نشد.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={normalizeProduct(product)} />
          ))}
        </div>
      )}
    </div>
  );
}