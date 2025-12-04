import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

export default function CategoryPage({ category, products }) {
  if (!category) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>دسته‌بندی یافت نشد</p>
        <Link href="/categories">
          <span className="text-blue-600 underline cursor-pointer">
            ← بازگشت به لیست دسته‌بندی‌ها
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-light mb-8">🗂️ دسته‌بندی: {category.title}</h1>
      {products.length === 0 ? (
        <p className="text-gray-500">محصولی در این دسته‌بندی یافت نشد.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export async function getStaticPaths() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`);
  const categories = await res.json();
  const paths = categories.map((c) => ({ params: { slug: c.slug } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  try {
    const resCat = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/${params.slug}`);
    const category = await resCat.json();
    const resProducts = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products?category=${params.slug}`);
    const products = await resProducts.json();
    return { props: { category, products } };
  } catch {
    return { props: { category: null, products: [] } };
  }
}