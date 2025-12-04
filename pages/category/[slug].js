export async function getStaticPaths() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`);
    if (!res.ok) {
      return { paths: [], fallback: false };
    }
    const categories = await res.json();
    const paths = categories.map((c) => ({ params: { slug: c.slug } }));
    return { paths, fallback: false };
  } catch {
    return { paths: [], fallback: false };
  }
}

export async function getStaticProps({ params }) {
  try {
    const resCat = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/${params.slug}`);
    const category = resCat.ok ? await resCat.json() : null;

    const resProducts = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products?category=${params.slug}`);
    const products = resProducts.ok ? await resProducts.json() : [];

    return { props: { category, products } };
  } catch {
    return { props: { category: null, products: [] } };
  }
}