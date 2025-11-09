import '@/styles/globals.css';
import Header from '@/components/Header';

export default function App({ Component, pageProps }) {
  return (
    <div className="bg-white text-gray-800 font-sans">
      <Header />
      <main className="min-h-screen">
        <Component {...pageProps} />
      </main>
    </div>
  );
}