"use client";

import { useEffect, useState } from "react";
import { Product, getAllProducts } from "@/lib/api";
import { formatPrice, toBengaliDigits } from "@/lib/utils";

interface TickerProps {
  products?: Product[];
}

export default function PriceTicker({ products: initialProducts }: TickerProps) {
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!initialProducts || initialProducts.length === 0) {
      getAllProducts().then((data) => {
        if (data && data.length > 0) {
          setFetchedProducts(data);
        }
      });
    }
  }, [initialProducts]);

  const products = initialProducts && initialProducts.length > 0 ? initialProducts : fetchedProducts;

  if (!products || products.length === 0) return null;
  const items = [...products, ...products];

  return (
    <div className="bg-[#FAFCFA] border-b border-[#E1E8E1] overflow-hidden py-2 select-none pointer-events-none">
      <div className="ticker-track flex w-max items-center pointer-events-none">
        {items.map((p, i) => {
          const dir = p.change?.dir || "flat";
          const pct = Math.abs(p.change?.pct ?? 0).toFixed(1);
          const changeColorClass =
            dir === "up" ? "text-[#D03739]" : dir === "down" ? "text-[#1a7a3c]" : "text-[#888]";

          return (
            <div
              key={`ticker-${p.id}-${i}`}
              className="inline-flex items-center gap-2 px-5 text-xs whitespace-nowrap border-r border-[#e0e0e0] shrink-0"
            >
              <span className="text-base">{p.image || "📦"}</span>
              <span className="font-semibold text-[#1D271F]">{p.nameBn}</span>
              <span className="text-[#1D271F]">
                {formatPrice(p.today)} টাকা/{p.unit === "kg" ? "কেজি" : p.unit === "litre" ? "লিটার" : p.unit === "dozen" ? "ডজন" : "পিস"}
              </span>
              <span className={`font-bold inline-flex items-center gap-0.5 ${changeColorClass}`}>
                <span>{dir === "up" ? "▲" : dir === "down" ? "▼" : "—"}</span>
                <span>{toBengaliDigits(pct)}%</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
