import { getProductBySlug } from "@/lib/api";
import { formatDecimalPrice, toBengaliDigits } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "পণ্য পাওয়া যায়নি — বাজার দর" };
  return {
    title: `${product.nameBn} — আজকের বাজার দর`,
    description: `${product.nameBn}: আজকের দাম ${toBengaliDigits(product.today)} টাকা/${product.unit}. বিভিন্ন বাজারের বিস্তারিত দাম জানুন।`,
  };
}

async function ProductDetailContent({ params }: PageProps) {
  const { slug } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    const { redirect } = await import("next/navigation");
    redirect(`/signin?redirect=/product/${slug}`);
  }

  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const markets = product.markets || [];
  const allMins = markets.map((m) => m.min);
  const allMaxs = markets.map((m) => m.max);
  const overallMin = allMins.length > 0 ? Math.min(...allMins) : product.today;
  const overallMax = allMaxs.length > 0 ? Math.max(...allMaxs) : product.today;
  const averagePrice =
    markets.length > 0
      ? Math.round(markets.reduce((sum, m) => sum + (m.min + m.max) / 2, 0) / markets.length)
      : product.today;

  const unitName =
    product.unit === "kg"
      ? "কেজি"
      : product.unit === "litre"
      ? "লিটার"
      : product.unit === "dozen"
      ? "ডজন"
      : "পিস";

  const categoryName = product.categoryNameBn || product.categoryBn || "পণ্য";
  const priceDiff = Math.abs(product.today - product.yesterday);
  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";

  return (
    <div className="max-w-[1100px] mx-auto px-4 pt-4 pb-10">
      <div className="flex items-center gap-2 text-xs text-[#718096] my-3">
        <Link href="/" className="text-[#718096] no-underline hover:text-[#1a7a3c]">
          হোম
        </Link>
        <span className="text-[#a0aec0]">›</span>
        <Link
          href={`/category/${product.category}`}
          className="text-[#718096] no-underline hover:text-[#1a7a3c]"
        >
          {categoryName}
        </Link>
        <span className="text-[#a0aec0]">›</span>
        <span className="text-[#2d3748] font-medium">{product.nameBn}</span>
      </div>
      <div className="bg-white rounded-2xl p-6 md:p-7 border border-[#eef2ef] shadow-[0_1px_4px_rgba(0,0,0,0.03)] flex items-center justify-between flex-wrap gap-5">
        <div className="flex items-center gap-4.5 min-w-[260px]">
          <div className="w-[72px] h-[72px] rounded-2xl bg-[#f0f7f3] flex items-center justify-center text-4xl shrink-0">
            {product.image || "📦"}
          </div>

          <div>
            <h1 className="text-[clamp(20px,3vw,24px)] font-extrabold text-[#1a202c] mb-1 leading-tight">
              {product.nameBn}
            </h1>
            <div className="text-xs text-[#718096] mb-1.5">
              প্রতি {unitName} · {categoryName}
            </div>
            <div className="text-xs text-[#4a5568]">
              গতকালের তুলনায় আজ দাম{" "}
              {isUp ? (
                <span>
                  বেড়েছে • {toBengaliDigits(priceDiff)} টাকা
                </span>
              ) : isDown ? (
                <span>
                  কমেছে • {toBengaliDigits(priceDiff)} টাকা
                </span>
              ) : (
                <span>অপরিবর্তিত</span>
              )}
            </div>
          </div>
        </div>
        <div className="bg-[#f7faf8] border border-[#edf2ee] rounded-xl px-7 py-3 text-center min-w-[140px]">
          <div className="text-xs text-[#718096] mb-0.5">আজকের দাম</div>
          <div className="text-3xl font-extrabold text-[#1a202c] leading-tight">
            {toBengaliDigits(product.today)}
          </div>
          <div className="text-xs text-[#718096] mt-0.5 mb-2">
            টাকা / {unitName}
          </div>
          <div>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isUp
                  ? "bg-[#fef2f2] text-[#dc2626]"
                  : isDown
                  ? "bg-[#f0fdf4] text-[#16a34a]"
                  : "bg-[#f3f4f6] text-[#6b7280]"
              }`}
            >
              <span>{isUp ? "▲" : isDown ? "▼" : "—"}</span>
              <span>
                {product.change ? toBengaliDigits(Math.abs(product.change.pct).toFixed(1)) : "০.০"}%
              </span>
            </span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-8 border border-[#eef2ef] shadow-[0_1px_4px_rgba(0,0,0,0.03)] mt-6">
        <div className="mb-9">
          <h2 className="text-lg font-bold text-[#1a202c] mb-4">
            দামের সারসংক্ষেপ
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white border border-[#e8f2ea] rounded-xl p-5">
              <div className="text-xs text-[#718096] mb-1">সর্বনিম্ন দাম</div>
              <div className="text-2xl font-extrabold text-[#16a34a] mb-1">
                {toBengaliDigits(overallMin)} টাকা
              </div>
              <div className="text-[11px] text-[#a0aec0]">সবচেয়ে কম দামের বাজার</div>
            </div>
            <div className="bg-white border border-[#fee2e2] rounded-xl p-5">
              <div className="text-xs text-[#718096] mb-1">সর্বাধিক দাম</div>
              <div className="text-2xl font-extrabold text-[#dc2626] mb-1">
                {toBengaliDigits(overallMax)} টাকা
              </div>
              <div className="text-[11px] text-[#a0aec0]">সবচেয়ে বেশি দামের বাজার</div>
            </div>
            <div className="bg-white border border-[#e8f2ea] rounded-xl p-5">
              <div className="text-xs text-[#718096] mb-1">গড় দাম</div>
              <div className="text-2xl font-extrabold text-[#16a34a] mb-1">
                {toBengaliDigits(averagePrice)} টাকা
              </div>
              <div className="text-[11px] text-[#a0aec0]">প্রতি {unitName}-এর হিসাবে</div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#1a202c] mb-4">
            বাজারভিত্তিক আজকের দাম
          </h2>

          <div className="overflow-x-auto -mx-2 px-2">
            <table className="w-full border-collapse text-left min-w-[540px]">
              <thead>
                <tr className="border-b border-[#edf2ee]">
                  <th className="p-3.5 px-4 text-xs font-semibold text-[#718096]">
                    বাজার
                  </th>
                  <th className="p-3.5 px-4 text-xs font-semibold text-[#718096]">
                    বিভাগ
                  </th>
                  <th className="p-3.5 px-4 text-xs font-semibold text-[#718096]">
                    সর্বনিম্ন
                  </th>
                  <th className="p-3.5 px-4 text-xs font-semibold text-[#718096]">
                    সর্বাধিক
                  </th>
                  <th className="p-3.5 px-4 text-xs font-semibold text-[#718096] text-right">
                    গড়
                  </th>
                </tr>
              </thead>
              <tbody>
                {markets.map((m, index) => {
                  const avg = (m.min + m.max) / 2;
                  return (
                    <tr
                      key={`${m.market}-${index}`}
                      className="border-b border-[#f0f4f1] transition-colors hover:bg-[#fafdfa]"
                    >
                      <td className="p-3.5 px-4 text-sm font-semibold text-[#1a202c]">
                        {m.market}
                      </td>
                      <td className="p-3.5 px-4 text-sm text-[#4a5568]">
                        {m.division}
                      </td>
                      <td className="p-3.5 px-4 text-sm text-[#4a5568]">
                        {toBengaliDigits(m.min)} টাকা
                      </td>
                      <td className="p-3.5 px-4 text-sm text-[#4a5568]">
                        {toBengaliDigits(m.max)} টাকা
                      </td>
                      <td className="p-3.5 px-4 text-sm font-bold text-[#1a202c] text-right">
                        {formatDecimalPrice(avg)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1100px] mx-auto px-4 py-10 flex justify-center">
          <div className="animate-pulse bg-[#e8ede8] w-full max-w-[900px] h-[450px] rounded-2xl" />
        </div>
      }
    >
      <ProductDetailContent params={params} />
    </Suspense>
  );
}
