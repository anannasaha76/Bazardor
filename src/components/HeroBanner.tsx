import Image from "next/image";

export default function HeroBanner() {
  return (
    <section
      style={{
        background: "linear-gradient(135deg, #f0f7f2 0%, #e8f5ed 100%)",
        borderRadius: 16,
        padding: "36px 40px",
        marginBottom: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
        border: "1px solid #d4ead9",
        overflow: "hidden",
      }}
    >
      <div style={{ flex: 1, maxWidth: 540 }}>
        <div
          style={{
            display: "inline-block",
            background: "#1a7a3c",
            color: "white",
            padding: "4px 12px",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 12,
          }}
        >
          🗓️ আজকের বাজারদর
        </div>

        <h1
          style={{
            fontSize: "clamp(24px, 4vw, 34px)",
            fontWeight: 800,
            color: "#1a1a1a",
            lineHeight: 1.25,
            margin: "0 0 12px",
          }}
        >
          আজকের বাজারের দাম এক নজরে
        </h1>

        <p style={{ fontSize: 15, color: "#555", lineHeight: 1.6, margin: "0 0 24px" }}>
          চাল, ডাল, সবজি, মাছ, মাংস ও মসলার — বাংলাদেশের বিভিন্ন বাজারের আজকের দাম এবং পরিবর্তন দেখুন।
        </p>

        <a
          href="#products"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#1a7a3c",
            color: "white",
            padding: "12px 26px",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 15,
            textDecoration: "none",
            boxShadow: "0 4px 14px rgba(26,122,60,0.25)",
          }}
        >
          🛒 সব দাম দেখুন
        </a>
      </div>

      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Image
          src="/bazar-hero.png"
          alt="বাজারের ঝুড়ি"
          width={220}
          height={220}
          style={{ objectFit: "contain", filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.1))" }}
          priority
        />
      </div>
    </section>
  );
}
