import { getAllProducts } from "@/lib/api";
import { Product } from "@/lib/api";
import PriceTicker from "@/components/PriceTicker";
import ProductCard from "@/components/ProductCard";
import HeroBanner from "@/components/HeroBanner";

export default async function HomePage() {
  let products: Product[] = [];
  try {
    products = await getAllProducts();
  } catch {
    products = [];
  }

  const risers = [...products]
    .filter((p) => p.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  const fallers = [...products]
    .filter((p) => p.change.dir === "down")
    .sort((a, b) => a.change.pct - b.change.pct)
    .slice(0, 6);

  return (
    <>
      {products.length > 0 && <PriceTicker products={products} />}

      <div className="max-w-[1100px] mx-auto px-4 py-6">
        <HeroBanner />

        {risers.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-[#D03739] mb-4 flex items-center gap-2">
             ▲ <span className="text-[#1D271F]">আজ দাম বেড়েছে</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {risers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {fallers.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="text-[#1A9951]">▼</span>
            <span className="text-[#1D271F]">আজ দাম কমেছে</span>
             </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {fallers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        <section id="all-products" className="scroll-mt-24">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#1D271F] mb-1">সব পণ্য</h2>
            <p className="text-xs text-[#1D271F]/70 m-0">মোট {products.length > 0 ? <><span className=" text-[#1D271F]/70">{(() => { const bengaliDigits = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"]; return String(products.length).replace(/\d/g, d => bengaliDigits[parseInt(d)]); })()}টি</span> পণ্য দেখানো হচ্ছে</> : "পণ্য লোড হচ্ছে..."}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
