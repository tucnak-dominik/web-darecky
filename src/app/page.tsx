import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Hero } from '@/components/hero';

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-dvh">
        <Hero />
        {/* product grid follows in next phase */}
      </main>
      <Footer />
    </>
  );
}
