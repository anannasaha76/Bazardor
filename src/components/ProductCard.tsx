"use client";

import Link from "next/link";
import { Product } from "@/lib/api";
import { formatPrice, formatUnit, toBengaliDigits } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dir = product.change?.dir || "flat";
  const absPct = Math.abs(product.change?.pct ?? 0).toFixed(1);

  const changeTextColor =
    dir === "up" ? "text-[#D03739]" : dir === "down" ? "text-[#047F39]" : "text-[#666666]";

  return (
    <Link href={`/product/${product.slug || product.id}`} className="no-underline block h-full">
      <div className="bg-[#FAFCFA] rounded-[20px] p-4.5 border border-[#E3EBE3] h-full flex flex-col justify-between transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:border-[#047F39]/40">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-[16px] bg-[#F0F5F0] flex items-center justify-center shrink-0 text-3xl select-none">
            {product.image || "📦"}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-[#1D271F] leading-tight m-0 truncate">
              {product.nameBn}
            </h3>
            <p className="text-xs text-[#1D271F] mt-1 mb-0 font-normal">
              {formatUnit(product.unit)}
            </p>
          </div>
        </div>

        
        <div className="flex items-end justify-between mt-5 pt-1">
          <div>
            <span className="block text-xs text-[#1D271F] mb-1 font-medium">আজকের দাম</span>
            <div className="flex items-baseline gap-1">
              <span className="text-[22px] font-extrabold text-[#1D271F] leading-none">
                {formatPrice(product.today)}
              </span>
              <span className="text-base font-semibold text-[#1D271F]">টাকা</span>
            </div>
          </div>

          <div
            className={`bg-[#F0F5F1] px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 shrink-0 ${changeTextColor}`}
          >
            <span>{dir === "up" ? "▲" : dir === "down" ? "▼" : "—"}</span>
            <span>{toBengaliDigits(absPct)}%</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
