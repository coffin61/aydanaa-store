// pages/admin/test-product/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (id) {
      const products = JSON.parse(localStorage.getItem('products') || '[]');
      const found = products.find((p) => p.id === parseInt(id));
      setProduct(found);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>محصولی با این شناسه پیدا نشد.</p>
        <Link href="/admin/products">
          <span className="text-blue-600 underline cursor-pointer">بازگشت به لیست محصولات</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <img src={product.image} alt={product.title} className="w-full h-96 object-cover rounded mb-6" />
      <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
      <p className="text-gray-600 mb-2">دسته‌بندی: {product.category}</p>
      <p className="text-green-700 font-semibold text-lg mb-4">{product.price.toLocaleString()} تومان</p>
      <p className="text-gray-700 leading-relaxed">
        اینجا می‌تونی توضیحات تستی محصول رو بنویسی. این صفحه فقط برای تست لوکال ساخته شده و بعداً با API جایگزین می‌شه.
      </p>
      <div className="mt-6">
        <Link href="/admin/products">
          <span className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 cursor-pointer">
            بازگشت به پنل ادمین
          </span>
        </Link>
      </div>
    </div>
  );
}