"use client";

import Image from "next/image";
import { useBanglaDate } from "@/lib/use-bangla-date";

export default function HeroBanner() {
  const banglaDate = useBanglaDate();

  return (
    <section className="bg-gradient-to-br from-[#FAFCFA] to-[#F3F9F4] rounded-2xl md:rounded-3xl p-5 sm:p-8 md:p-10 mb-6 md:mb-8 flex flex-col-reverse md:flex-row items-center md:justify-between gap-5 md:gap-6 border border-[#E1E8E1] overflow-hidden">
      <div className="w-full md:flex-1 md:max-w-[540px]">
        {banglaDate ? (
          <div className="inline-block bg-[#E5F3E7] text-[#05893E] px-3 py-1 sm:px-3.5 rounded-full text-[11px] sm:text-xs font-semibold mb-3">
            {banglaDate}
          </div>
        ) : (
          <div className="h-6 w-36 bg-[#E5F3E7] rounded-full animate-pulse mb-3" />
        )}

        <h1 className="text-[clamp(22px,6vw,34px)] font-extrabold text-[#1D271F] leading-[1.3] md:leading-[1.25] mb-2.5 md:mb-3">
          আজকের বাজারের দাম এক নজরে
        </h1>

        <p className="text-sm sm:text-[15px] text-[#1D271F]/70 leading-[1.6] mb-5 md:mb-6">
          চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
        </p>

        <a
          href="#all-products"
          className="flex w-full sm:w-auto sm:inline-flex items-center justify-center gap-2 bg-[#05893E] text-[#F3FBF4] px-5 py-3 sm:py-2.5 rounded-lg font-semibold text-sm no-underline shadow-[#047F39] transition-colors hover:bg-[#047F39] active:bg-[#047F39]"
        >
          সব পণ্য দেখুন
        </a>
      </div>

      <div className="shrink-0 flex items-center justify-center">
        <Image
          src="/bazar-hero.png"
          alt="বাজারের ঝুড়ি"
          width={220}
          height={220}
          sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, 220px"
          className="object-contain w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] md:w-[220px] md:h-[220px] drop-shadow-[0_8px_16px_rgba(0,0,0,0.08)]"
          priority
        />
      </div>
    </section>
  );
}