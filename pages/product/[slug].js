import { useCart } from '@/context/CartContext';

export default function ProductDetailsPage({ product }) {
  const { addToCart } = useCart();

  if (!product) return <p className="p-8">محصولی یافت نشد</p>;

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold text-blue-700">{product.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <img
          src={product.image || '/placeholder.png'}
          alt={product.title}
          className="w-full h-64 object-cover rounded"
        />

        <div className="space-y-4">
          <p className="text-green-700 text-xl font-bold">
            {product.price.toLocaleString()} تومان
          </p>
          <p className="text-gray-600">
            دسته‌بندی: {product.category?.title || 'بدون دسته‌بندی'}
          </p>
          <p className="text-gray-600">موجودی: {product.stock}</p>
          <p className="text-gray-800 whitespace-pre-line">{product.description}</p>

          <button
            onClick={() => addToCart(product)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            🛒 افزودن به سبد خرید
          </button>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const res = await fetch(`http://localhost:3000/api/products/${params.slug}`);
  const product = await res.json();

  return {
    props: {
      product: product || null,
    },
  };
}