import Link from 'next/link';

export default function ProductCard({ title, price, image, id }) {
  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingItem = cart.find((item) => item.id === id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id,
        title,
        price: parseInt(price), // 👈 تبدیل مطمئن به عدد
        image,
        quantity: 1,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('محصول به سبد خرید اضافه شد!');
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-64">
      <Link href={`/product/${id}`}>
        <img
          src={image}
          alt={title}
          className="w-full h-40 object-cover cursor-pointer"
        />
      </Link>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-blue-600 font-bold mb-4">{parseInt(price).toLocaleString()} تومان</p>
        <div className="flex gap-2">
          <Link href={`/product/${id}`} className="flex-1">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">
              مشاهده جزئیات
            </button>
          </Link>
          <button
            onClick={handleAddToCart}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
          >
            افزودن
          </button>
        </div>
      </div>
    </div>
  );
}