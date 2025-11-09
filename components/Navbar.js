import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-600">Aydanaa</h1>
      <div className="space-x-6 text-gray-700 text-lg">
        <Link href="/">خانه</Link>
        <Link href="/shop">محصولات</Link>
        <Link href="/about">درباره ما</Link>
        <Link href="/contact">تماس با ما</Link>
      </div>
    </nav>
  );
}