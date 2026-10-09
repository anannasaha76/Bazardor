"use client";

import { Product } from "@/lib/api";
import { formatPrice, toBengaliDigits } from "@/lib/utils";

interface TickerProps {
  products: Product[];
}

export default function PriceTicker({ products }: TickerProps) {
  if (!products || products.length === 0) return null;
  const items = [...products, ...products];

  return (
    <div style={{ background: "#f7f9f7", borderBottom: "1px solid #e8ede8", overflow: "hidden", padding: "8px 0" }}>
      <div className="ticker-track">
        {items.map((p, i) => {
          const dir = p.change?.dir || "flat";
          const pct = Math.abs(p.change?.pct ?? 0).toFixed(1);
          return (
            <span
              key={`${p.id}-${i}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "0 20px",
                fontSize: 13,
                whiteSpace: "nowrap",
                borderRight: "1px solid #e0e0e0",
                flexShrink: 0,
              }}
            >
              <span>{p.image || "📦"}</span>
              <span style={{ fontWeight: 600, color: "#1a1a1a" }}>{p.nameBn}</span>
              <span style={{ color: "#555" }}>
                {formatPrice(p.today)} টাকা/{p.unit === "kg" ? "কেজি" : p.unit === "litre" ? "লিটার" : p.unit === "dozen" ? "ডজন" : "পিস"}
              </span>
              <span
                style={{
                  fontWeight: 700,
                  color: dir === "up" ? "#e53e3e" : dir === "down" ? "#1a7a3c" : "#888",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <span>{dir === "up" ? "▲" : dir === "down" ? "▼" : "—"}</span>
                <span>{toBengaliDigits(pct)}%</span>
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
