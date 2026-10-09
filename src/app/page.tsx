import { getAllProducts } from "@/lib/api";
import { Product } from "@/lib/api";
import PriceTicker from "@/components/PriceTicker";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import Link from "next/link";

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

      <div className="container-main" style={{ padding: "24px 16px" }}>

        <section style={{
          background: "linear-gradient(135deg, #f0f7f2 0%, #e8f5ed 100%)",
          borderRadius: 16, padding: "32px 40px", marginBottom: 32,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 20, border: "1px solid #d4ead9", overflow: "hidden", position: "relative"
        }}>
          <div style={{ flex: 1, maxWidth: 520 }}>
            <div style={{
              display: "inline-block", background: "#1a7a3c", color: "white",
              padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 12
            }}>
              🗓️ আজকের বাজারদর
            </div>
            <h1 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 800, color: "#1a1a1a", lineHeight: 1.25, marginBottom: 10, margin: "0 0 10px" }}>
              আজকের বাজারের দাম এক নজরে
            </h1>
            <p style={{ fontSize: 15, color: "#555", lineHeight: 1.6, marginBottom: 20, margin: "0 0 20px" }}>
              চাল, ডাল, সবজি, মাছ, মাংস ও মসলার — বাংলাদেশের বিভিন্ন বাজারের আজকের দাম এবং পরিবর্তন দেখুন।
            </p>
            <a
              href="#সব-পণ্য"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#1a7a3c", color: "white", padding: "11px 24px",
                borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none",
                transition: "background 0.2s", boxShadow: "0 4px 14px rgba(26,122,60,0.3)"
              }}
              onMouseEnter={undefined}
            >
              🛒 সব দাম দেখুন
            </a>
          </div>
          <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Image
              src="/bazar-hero.png"
              alt="বাজারের ঝুড়ি"
              width={200}
              height={200}
              style={{ objectFit: "contain", filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.12))" }}
            />
          </div>
        </section>
        {risers.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h2 className="section-title" style={{ color: "#e53e3e", fontSize: 18, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              ▲ আজ দাম বেড়েছে
            </h2>
            <div className="products-grid">
              {risers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
        {fallers.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h2 className="section-title" style={{ color: "#1a7a3c", fontSize: 18, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              ▼ আজ দাম কমেছে
            </h2>
            <div className="products-grid">
              {fallers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
        <section id="সব-পণ্য">
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a", margin: "0 0 4px" }}>সব পণ্য</h2>
            <p style={{ fontSize: 13, color: "#888", margin: 0 }}>সকল পণ্যের আজকের দাম ও পরিবর্তন এক নজরে দেখুন</p>
          </div>
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
