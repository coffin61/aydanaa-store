import Link from 'next/link';

export default function CategoryPage({ category, products }) {
  if (!category) return <p className="p-8">دسته‌بندی یافت نشد</p>;

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold text-blue-700">محصولات دسته: {category.title}</h1>
      <p className="text-gray-600">{category.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
        {products.map((product) => (
          <Link key={product._id} href={`/product/${product.slug}`}>
            <div className="border p-4 rounded shadow hover:shadow-md cursor-pointer space-y-2">
              <img
                src={product.image || '/placeholder.png'}
                alt={product.title}
                className="w-full h-48 object-cover rounded"
              />
              <h2 className="text-lg font-semibold text-gray-800">{product.title}</h2>
              <p className="text-green-700 font-bold">
                {product.price.toLocaleString()} تومان
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const res = await fetch(`http://localhost:3000/api/categories/by-slug/${slug}`);
  const data = await res.json();

  return {
    props: {
      category: data.category || null,
      products: data.products || [],
    },
  };
}