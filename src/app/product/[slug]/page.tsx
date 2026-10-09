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
    <div className="container-main" style={{ padding: "16px 16px 40px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 13,
          color: "#718096",
          margin: "12px 0 16px",
        }}
      >
        <Link href="/" style={{ color: "#718096", textDecoration: "none" }}>
          হোম
        </Link>
        <span style={{ color: "#a0aec0" }}>›</span>
        <Link
          href={`/category/${product.category}`}
          style={{ color: "#718096", textDecoration: "none" }}
        >
          {categoryName}
        </Link>
        <span style={{ color: "#a0aec0" }}>›</span>
        <span style={{ color: "#2d3748", fontWeight: 500 }}>{product.nameBn}</span>
      </div>
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: "24px 28px",
          border: "1px solid #eef2ef",
          boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, minWidth: 260 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: "#f0f7f3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              flexShrink: 0,
            }}
          >
            {product.image || "📦"}
          </div>

          <div>
            <h1
              style={{
                fontSize: "clamp(20px, 3vw, 24px)",
                fontWeight: 800,
                color: "#1a202c",
                margin: "0 0 4px 0",
                lineHeight: 1.2,
              }}
            >
              {product.nameBn}
            </h1>
            <div style={{ fontSize: 13, color: "#718096", marginBottom: 6 }}>
              প্রতি {unitName} · {categoryName}
            </div>
            <div style={{ fontSize: 13, color: "#4a5568" }}>
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
        <div
          style={{
            background: "#f7faf8",
            border: "1px solid #edf2ee",
            borderRadius: 12,
            padding: "12px 28px",
            textAlign: "center",
            minWidth: 140,
          }}
        >
          <div style={{ fontSize: 12, color: "#718096", marginBottom: 2 }}>আজকের দাম</div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              color: "#1a202c",
              lineHeight: 1.1,
            }}
          >
            {toBengaliDigits(product.today)}
          </div>
          <div style={{ fontSize: 12, color: "#718096", marginTop: 2, marginBottom: 8 }}>
            টাকা / {unitName}
          </div>
          <div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "2px 10px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 700,
                background: isUp ? "#fef2f2" : isDown ? "#f0fdf4" : "#f3f4f6",
                color: isUp ? "#dc2626" : isDown ? "#16a34a" : "#6b7280",
              }}
            >
              <span>{isUp ? "▲" : isDown ? "▼" : "—"}</span>
              <span>
                {product.change ? toBengaliDigits(Math.abs(product.change.pct).toFixed(1)) : "০.০"}%
              </span>
            </span>
          </div>
        </div>
      </div>
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: "32px",
          border: "1px solid #eef2ef",
          boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
          marginTop: 24,
        }}
      >
        <div style={{ marginBottom: 36 }}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#1a202c",
              margin: "0 0 16px 0",
            }}
          >
            দামের সারসংক্ষেপ
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            <div
              style={{
                background: "white",
                border: "1px solid #e8f2ea",
                borderRadius: 12,
                padding: "18px 20px",
              }}
            >
              <div style={{ fontSize: 12, color: "#718096", marginBottom: 4 }}>সর্বনিম্ন দাম</div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#16a34a",
                  marginBottom: 4,
                }}
              >
                {toBengaliDigits(overallMin)} টাকা
              </div>
              <div style={{ fontSize: 11, color: "#a0aec0" }}>সবচেয়ে কম দামের বাজার</div>
            </div>
            <div
              style={{
                background: "white",
                border: "1px solid #fee2e2",
                borderRadius: 12,
                padding: "18px 20px",
              }}
            >
              <div style={{ fontSize: 12, color: "#718096", marginBottom: 4 }}>সর্বাধিক দাম</div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#dc2626",
                  marginBottom: 4,
                }}
              >
                {toBengaliDigits(overallMax)} টাকা
              </div>
              <div style={{ fontSize: 11, color: "#a0aec0" }}>সবচেয়ে বেশি দামের বাজার</div>
            </div>
            <div
              style={{
                background: "white",
                border: "1px solid #e8f2ea",
                borderRadius: 12,
                padding: "18px 20px",
              }}
            >
              <div style={{ fontSize: 12, color: "#718096", marginBottom: 4 }}>গড় দাম</div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#16a34a",
                  marginBottom: 4,
                }}
              >
                {toBengaliDigits(averagePrice)} টাকা
              </div>
              <div style={{ fontSize: 11, color: "#a0aec0" }}>প্রতি {unitName}-এর হিসাবে</div>
            </div>
          </div>
        </div>
        <div>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#1a202c",
              margin: "0 0 16px 0",
            }}
          >
            বাজারভিত্তিক আজকের দাম
          </h2>

          <div style={{ overflowX: "auto", margin: "0 -8px", padding: "0 8px" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
                minWidth: 540,
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid #edf2ee" }}>
                  <th
                    style={{
                      padding: "14px 16px",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#718096",
                    }}
                  >
                    বাজার
                  </th>
                  <th
                    style={{
                      padding: "14px 16px",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#718096",
                    }}
                  >
                    বিভাগ
                  </th>
                  <th
                    style={{
                      padding: "14px 16px",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#718096",
                    }}
                  >
                    সর্বনিম্ন
                  </th>
                  <th
                    style={{
                      padding: "14px 16px",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#718096",
                    }}
                  >
                    সর্বাধিক
                  </th>
                  <th
                    style={{
                      padding: "14px 16px",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#718096",
                      textAlign: "right",
                    }}
                  >
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
                      style={{
                        borderBottom: "1px solid #f0f4f1",
                        transition: "background 0.15s",
                      }}
                    >
                      <td
                        style={{
                          padding: "14px 16px",
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#1a202c",
                        }}
                      >
                        {m.market}
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 14, color: "#4a5568" }}>
                        {m.division}
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 14, color: "#4a5568" }}>
                        {toBengaliDigits(m.min)} টাকা
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 14, color: "#4a5568" }}>
                        {toBengaliDigits(m.max)} টাকা
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#1a202c",
                          textAlign: "right",
                        }}
                      >
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
        <div
          className="container-main"
          style={{ padding: "40px 16px", display: "flex", justifyContent: "center" }}
        >
          <div
            className="skeleton"
            style={{ width: "100%", maxWidth: 900, height: 450, borderRadius: 16 }}
          />
        </div>
      }
    >
      <ProductDetailContent params={params} />
    </Suspense>
  );
}
