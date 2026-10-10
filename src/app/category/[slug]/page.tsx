"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Product, Category, getAllCategories, getProductsByCategory, getCategoryBySlug } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import Link from "next/link";
import { toBengaliDigits } from "@/lib/utils";

type SortOption = "default" | "price-asc" | "price-desc";

function CategoryContent() {
  const params = useParams();
  const slug = params.slug as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [sort, setSort] = useState<SortOption>("default");
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    (async () => {
      if (!cancelled) setLoading(true);
      try {
        const [allCats, prodsData] = await Promise.all([
          getAllCategories(),
          getProductsByCategory(slug),
        ]);

        if (cancelled) return;

        const catData =
          allCats.find((c) => c.slug === slug || (slug === "dim-dudh" && c.slug === "dim-dui")) ||
          getCategoryBySlug(slug);

        if (!catData && prodsData.length === 0) {
          setNotFound(true);
        } else {
          setCategory(catData || { slug, nameBn: slug, icon: "🛒" });
          setProducts(prodsData);
          setNotFound(false);
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sort === "price-asc") return a.today - b.today;
    if (sort === "price-desc") return b.today - a.today;
    return 0;
  });

  const sortLabels: Record<SortOption, string> = {
    default: "ডিফল্ট",
    "price-asc": "দাম: কম থেকে বেশি",
    "price-desc": "দাম: বেশি থেকে কম",
  };

  if (!loading && notFound) {
    return (
      <div className="max-w-[1100px] mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">ক্যাটেগরি পাওয়া যায়নি</h1>
        <p className="text-[#888] mb-6">এই ক্যাটেগরিতে কোনো পণ্য নেই বা ক্যাটেগরিটি বিদ্যমান নেই।</p>
        <Link href="/" className="bg-[#1a7a3c] text-white px-6 py-2.5 rounded-lg no-underline font-semibold hover:bg-[#155f30] transition-colors">
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl p-5 mb-4 border border-[#eaeaea] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        {loading ? (
          <div className="flex gap-4 items-center">
            <div className="animate-pulse bg-[#e8ede8] w-12 h-12 rounded-xl shrink-0" />
            <div>
              <div className="animate-pulse bg-[#e8ede8] h-5.5 w-[120px] mb-1.5 rounded" />
              <div className="animate-pulse bg-[#e8ede8] h-3.5 w-[180px] rounded" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="text-[44px] leading-none">{category?.icon}</div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#1D271F] mb-1">{category?.nameBn}</h1>
              <p className="text-xs text-[#1D271F]/70 m-0">
                {toBengaliDigits(sortedProducts.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl px-5 py-3 mb-4 border border-[#eaeaea] flex items-center justify-between sm:justify-end gap-3">
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#1D271F]/70">সাজান:</span>
          <div className="relative">
            <button
              id="sort-btn"
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#e0e0e0] rounded-lg text-xs font-medium bg-white cursor-pointer text-[#1a1a1a] hover:border-[#1a7a3c] transition-colors"
            >
              {sortLabels[sort]} <span className="text-[10px]">▾</span>
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-[calc(100%+4px)] bg-white border border-[#e0e0e0] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.10)] min-w-[200px] z-50 overflow-hidden">
                {(Object.entries(sortLabels) as [SortOption, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => { setSort(key); setSortOpen(false); }}
                    className={`block w-full px-4 py-2.5 text-left text-xs border-0 cursor-pointer ${sort === key ? "bg-[#e8f5ed] text-[#1a7a3c] font-bold" : "bg-white text-[#1a1a1a] font-normal hover:bg-[#f9f9f9]"
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mb-4"  >
      <span className="text-xs text-[#1D271F]/70">
          {!loading && `মোট ${toBengaliDigits(sortedProducts.length)} টি পণ্য দেখানো হচ্ছে`}
        </span>
        </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : sortedProducts.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>

      {!loading && sortedProducts.length === 0 && (
        <div className="text-center py-15 px-5">
          <div className="text-5xl mb-3">🛒</div>
          <h2 className="text-lg text-[#555] mb-4">এই ক্যাটেগরিতে কোনো পণ্য নেই</h2>
          <Link href="/" className="bg-[#1a7a3c] text-white px-6 py-2.5 rounded-lg no-underline font-semibold hover:bg-[#155f30] transition-colors">
            হোম পেজে ফিরে যান
          </Link>
        </div>
      )}
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={
      <div className="max-w-[1100px] mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-5 mb-4 border border-[#eaeaea]">
          <div className="flex gap-4 items-center">
            <div className="animate-pulse bg-[#e8ede8] w-12 h-12 rounded-xl" />
            <div>
              <div className="animate-pulse bg-[#e8ede8] h-5.5 w-[120px] mb-1.5 rounded" />
              <div className="animate-pulse bg-[#e8ede8] h-3.5 w-[180px] rounded" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      </div>
    }>
      <CategoryContent />
    </Suspense>
  );
}
