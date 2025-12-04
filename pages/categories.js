// pages/categories.js
import Link from 'next/link';

export default function CategoriesPage() {
  const categories = [
    { title: 'سرامیک دیواری', image: '/wall.jpg', slug: 'wall' },
    { title: 'سرامیک کف', image: '/floor.jpg', slug: 'floor' },
    { title: 'کاشی آشپزخانه', image: '/kitchen.jpg', slug: 'kitchen' },
    { title: 'کاشی سرویس بهداشتی', image: '/bath.jpg', slug: 'bath' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 font-vazir px-4 py-10 max-w-6xl mx-auto">
      <h1 className="text-2xl font-light mb-8 text-center">دسته‌بندی‌ها</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <Link key={cat.slug} href={`/category/${cat.slug}`}>
            <div className="group cursor-pointer border bg-white hover:shadow transition">
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-48 object-cover"
              />
              <p className="text-center py-4 text-lg group-hover:text-black transition">
                {cat.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}