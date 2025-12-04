// pages/search.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ProductCard from '@/components/ProductCard';

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;

  const [products, setProducts] = useState([]);
  const [results, setResults] = useState([]);
  const [sort, setSort] = useState('default');
  const [suggestions, setSuggestions] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(stored);
  }, []);

  useEffect(() => {
    if (!q || !products.length) return;

    const keyword = q.toLowerCase();
    const filtered = products.filter((p) =>
      p.title.toLowerCase().includes(keyword) ||
      p.description?.toLowerCase().includes(keyword) ||
      p.category?.toLowerCase().includes(keyword)
    );

    setResults(filtered);
  }, [q, products]);

  useEffect(() => {
    let sorted = [...results];
    if (sort === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sort === 'title') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    setResults(sorted);
  }, [sort]);

  useEffect(() => {
    const keyword = input.toLowerCase();
    if (!keyword || !products.length) {
      setSuggestions([]);
      return;
    }

    const matches = products
      .filter((p) => p.title.toLowerCase().includes(keyword))
      .slice(0, 5);

    setSuggestions(matches);
  }, [input, products]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    router.push(`/search?q=${encodeURIComponent(input.trim())}`);
    setInput('');
    setSuggestions([]);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 font-vazir px-4 py-10 max-w-6xl mx-auto">
      <h1 className="text-2xl font-light mb-6">
        نتایج جستجو برای: <span className="font-semibold text-black">{q}</span>
      </h1>

      {/* نوار جستجو با پیشنهادات */}
      <form onSubmit={handleSearch} className="mb-6 relative">
        <input
          type="text"
          placeholder="جستجوی جدید..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full border px-4 py-2 rounded text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-300"
        />
        {suggestions.length > 0 && (
          <ul className="absolute top-full left-0 right-0 bg-white border mt-1 rounded shadow text-sm z-10">
            {suggestions.map((s) => (
              <li
                key={s.id}
                onClick={() => {
                  router.push(`/search?q=${encodeURIComponent(s.title)}`);
                  setInput('');
                  setSuggestions([]);
                }}
                className="px-4 py-2 hover:bg-neutral-100 cursor-pointer"
              >
                {s.title}
              </li>
            ))}
          </ul>
        )}
      </form>

      {/* مرتب‌سازی */}
      <div className="mb-6 flex items-center gap-4 text-sm">
        <label>مرتب‌سازی:</label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border px-3 py-1 rounded text-sm text-neutral-700"
        >
          <option value="default">پیش‌فرض</option>
          <option value="price-asc">ارزان‌ترین</option>
          <option value="price-desc">گران‌ترین</option>
          <option value="title">عنوان</option>
        </select>
      </div>

      {/* نتایج */}
      {results.length === 0 ? (
        <p className="text-neutral-500">هیچ محصولی با این عبارت یافت نشد.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}