import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { ProductGrid } from '@/components/product-grid';

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-dvh">
        <Hero />
        <ProductGrid />
      </main>
      <Footer />
    </>
  );
}
