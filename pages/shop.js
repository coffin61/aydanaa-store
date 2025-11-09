import ProductCard from '../components/ProductCard';

export default function Shop() {
  const products = [
  {
    id: 1,
    title: 'کفش ورزشی مردانه',
    price: '450,000',
    image: 'https://picsum.photos/id/21/300/200',
  },
  {
    id: 2,
    title: 'ساعت هوشمند',
    price: '1,200,000',
    image: 'https://picsum.photos/id/1010/300/200',
  },
  {
    id: 3,
    title: 'هدفون بی‌سیم',
    price: '850,000',
    image: 'https://picsum.photos/id/1025/300/200',
  },
];

  return (
    <div className="p-8">
      <h2 className="text-3xl font-semibold mb-6 text-center">محصولات ما</h2>
      <div className="flex flex-wrap gap-6 justify-center">
        {products.map((item, index) => (
          <ProductCard
            key={index}
            title={item.title}
            price={item.price}
            image={item.image}
          />
        ))}
      </div>
    </div>
  );
}