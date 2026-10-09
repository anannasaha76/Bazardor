"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Product, Category } from "@/lib/api";
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

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [catRes, prodsRes] = await Promise.all([
        fetch(`https://api.abcz.workers.dev/api/bazardor/categories/${slug}`),
        fetch(`https://api.abcz.workers.dev/api/bazardor/products?category=${slug}`),
      ]);

      if (!catRes.ok || !prodsRes.ok) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const catData: Category = await catRes.json();
      const prodsData: Product[] = await prodsRes.json();
      setCategory(catData);
      setProducts(prodsData);
      setNotFound(false);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      <div className="container-main" style={{ padding: "80px 16px", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>😕</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>ক্যাটেগরি পাওয়া যায়নি</h1>
        <p style={{ color: "#888", marginBottom: 24 }}>এই ক্যাটেগরিতে কোনো পণ্য নেই বা ক্যাটেগরিটি বিদ্যমান নেই।</p>
        <Link href="/" style={{ background: "#1a7a3c", color: "white", padding: "10px 24px", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <div className="container-main" style={{ padding: "24px 16px" }}>
     
      <div style={{ background: "white", borderRadius: 16, padding: "20px 24px", marginBottom: 16, border: "1px solid #eaeaea", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        {loading ? (
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 12 }} />
            <div>
              <div className="skeleton" style={{ height: 22, width: 120, marginBottom: 6 }} />
              <div className="skeleton" style={{ height: 14, width: 180 }} />
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontSize: 44, lineHeight: 1 }}>{category?.icon}</div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a1a", margin: "0 0 4px" }}>{category?.nameBn}</h1>
              <p style={{ fontSize: 13, color: "#888", margin: 0 }}>
                {toBengaliDigits(sortedProducts.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
              </p>
            </div>
          </div>
        )}
      </div>

     
      <div style={{ background: "white", borderRadius: 12, padding: "12px 20px", marginBottom: 16, border: "1px solid #eaeaea", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12 }}>
        <span style={{ fontSize: 13, color: "#888" }}>
          {!loading && `মোট ${toBengaliDigits(sortedProducts.length)} টি পণ্য দেখানো হচ্ছে`}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, color: "#555" }}>সাজান:</span>
          <div style={{ position: "relative" }}>
            <button
              id="sort-btn"
              onClick={() => setSortOpen(!sortOpen)}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
                border: "1.5px solid #e0e0e0", borderRadius: 8, fontSize: 13, fontWeight: 500,
                background: "white", cursor: "pointer", color: "#1a1a1a"
              }}
            >
              {sortLabels[sort]} <span style={{ fontSize: 10 }}>▾</span>
            </button>
            {sortOpen && (
              <div style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", background: "white", border: "1px solid #e0e0e0", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.10)", minWidth: 200, zIndex: 50, overflow: "hidden" }}>
                {(Object.entries(sortLabels) as [SortOption, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => { setSort(key); setSortOpen(false); }}
                    style={{
                      display: "block", width: "100%", padding: "10px 16px", textAlign: "left",
                      fontSize: 13, background: sort === key ? "#e8f5ed" : "white",
                      color: sort === key ? "#1a7a3c" : "#1a1a1a", border: "none", cursor: "pointer",
                      fontWeight: sort === key ? 700 : 400
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      
      <div className="products-grid">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : sortedProducts.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>

      {!loading && sortedProducts.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
          <h2 style={{ fontSize: 18, color: "#555", marginBottom: 16 }}>এই ক্যাটেগরিতে কোনো পণ্য নেই</h2>
          <Link href="/" style={{ background: "#1a7a3c", color: "white", padding: "10px 24px", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>
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
      <div className="container-main" style={{ padding: "24px 16px" }}>
        <div style={{ background: "white", borderRadius: 16, padding: "20px 24px", marginBottom: 16, border: "1px solid #eaeaea" }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 12 }} />
            <div>
              <div className="skeleton" style={{ height: 22, width: 120, marginBottom: 6 }} />
              <div className="skeleton" style={{ height: 14, width: 180 }} />
            </div>
          </div>
        </div>
        <div className="products-grid">
          {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      </div>
    }>
      <CategoryContent />
    </Suspense>
  );
}
