import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ProductDetailsPage({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!product || !product.id) {
      toast.error('❌ افزودن به سبد خرید ناموفق بود');
      return;
    }
    addToCart(product);
    toast.success('✅ محصول به سبد خرید اضافه شد');
  };

  if (!product) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>محصولی یافت نشد</p>
        <Link href="/products">
          <span className="text-blue-600 underline cursor-pointer">
            ← بازگشت به لیست محصولات
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="bg-white border">
        <img
          src={product.image || '/placeholder.jpg'}
          alt={product.title}
          className="w-full h-auto object-contain"
        />
      </div>
      <div className="space-y-6 text-gray-800">
        <h1 className="text-3xl font-light">{product.title}</h1>
        <div className="text-xl font-semibold text-black">
          {(product.price || 0).toLocaleString()} تومان
        </div>
        <p className="text-gray-600">
          دسته‌بندی: {product.category?.title || product.category || 'بدون دسته‌بندی'}
        </p>
        <p className="text-gray-600">موجودی: {product.stock ?? 'نامشخص'}</p>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {product.description || 'توضیحاتی ثبت نشده'}
        </p>
        <button
          onClick={handleAddToCart}
          className="bg-black text-white px-6 py-3 rounded-none hover:opacity-90 transition"
        >
          افزودن به سبد خرید
        </button>
        <div className="pt-6">
          <Link href="/products">
            <span className="text-gray-500 underline hover:text-black transition">
              ← بازگشت به لیست محصولات
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`);
  const products = await res.json();
  const paths = products.map((p) => ({ params: { slug: p.slug } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${params.slug}`);
    const product = await res.json();
    return { props: { product } };
  } catch {
    return { props: { product: null } };
  }
}