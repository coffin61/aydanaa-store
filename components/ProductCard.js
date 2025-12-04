// components/ProductCard.js
import Image from 'next/image';

export default function ProductCard({ product = {} }) {
  // مقداردهی پیش‌فرض برای جلوگیری از خطا
  const {
    id = `tmp-${Math.random().toString(36).slice(2)}`,
    name = 'بدون عنوان',
    description = 'توضیحات موجود نیست',
    price = 0,
    image = '/placeholder.png',
    category = {},
    brand = {},
  } = product;

  return (
    <div className="border rounded-lg shadow-sm bg-white overflow-hidden hover:shadow-md transition">
      {/* تصویر محصول */}
      <div className="relative w-full h-48">
        <Image
          src={image}
          alt={name}
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* جزئیات محصول */}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-light text-neutral-800">{name}</h3>
        <p className="text-sm text-neutral-500 line-clamp-2">{description}</p>

        {/* قیمت */}
        <p className="text-base font-semibold text-green-600">
          {price.toLocaleString()} تومان
        </p>

        {/* دسته و برند */}
        <div className="text-xs text-neutral-400">
          {category?.name && <span>📂 {category.name}</span>}
          {brand?.name && <span className="ml-2">🏷️ {brand.name}</span>}
        </div>
      </div>
    </div>
  );
}