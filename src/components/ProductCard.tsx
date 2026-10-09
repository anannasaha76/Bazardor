"use client";

import Link from "next/link";
import { Product } from "@/lib/api";
import { formatPrice, formatUnit, formatChange } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const changeBadgeClass =
    product.change.dir === "up"
      ? "badge-up"
      : product.change.dir === "down"
      ? "badge-down"
      : "badge-flat";

  return (
    <Link href={`/product/${product.slug || product.id}`} style={{ textDecoration: "none" }}>
      <div
        className="product-card"
        style={{
          background: "white",
          borderRadius: 12,
          padding: "16px",
          border: "1px solid #eaeaea",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 34, lineHeight: 1, flexShrink: 0 }}>{product.image}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#1a1a1a", lineHeight: 1.3, marginBottom: 3 }}>
              {product.nameBn}
            </div>
            <div style={{ fontSize: 12, color: "#888" }}>{formatUnit(product.unit)}</div>
          </div>
        </div>
        <div
          style={{
            borderTop: "1px solid #f5f5f5",
            paddingTop: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>আজকের দাম</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>
              {formatPrice(product.today)}{" "}
              <span style={{ fontSize: 13, fontWeight: 400, color: "#555" }}>টাকা</span>
            </div>
          </div>
          <span className={changeBadgeClass} style={{ fontSize: 13 }}>
            {formatChange(product.change.pct, product.change.dir)}
          </span>
        </div>
      </div>
    </Link>
  );
}
