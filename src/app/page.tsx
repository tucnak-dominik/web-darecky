import { EffectHost } from '@/components/effects/effect-host';
import { Footer } from '@/components/footer';
import { Hero } from '@/components/hero';
import { OwnerPopup } from '@/components/owner-popup';
import { ProductGrid } from '@/components/product-grid';

export default function Home() {
  return (
    <>
      <EffectHost />
      <main className="relative z-10 min-h-dvh">
        <Hero />
        <ProductGrid />
      </main>
      <Footer />
      <OwnerPopup />
    </>
  );
}
