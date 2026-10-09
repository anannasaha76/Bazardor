import { getAllProducts } from "@/lib/api";
import PriceTicker from "@/components/PriceTicker";
import HeroBanner from "@/components/HeroBanner";

export default async function HomePage() {
  const products = await getAllProducts();

  return (
    <>
      <PriceTicker products={products} />
      <div className="container-main" style={{ padding: "24px 16px" }}>
        <HeroBanner />
      </div>
    </>
  );
}
