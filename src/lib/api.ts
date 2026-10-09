export interface Category {
  slug: string;
  nameBn: string;
  icon: string;
}

export const CATEGORIES: Category[] = [
  { slug: "chal", nameBn: "চাল", icon: "🍚" },
  { slug: "dal", nameBn: "ডাল", icon: "🫘" },
  { slug: "tel", nameBn: "তেল", icon: "🛢️" },
  { slug: "sobji", nameBn: "সবজি", icon: "🥬" },
  { slug: "mach", nameBn: "মাছ", icon: "🐟" },
  { slug: "mangsho", nameBn: "মাংস", icon: "🍗" },
  { slug: "dim-dui", nameBn: "ডিম-দুধ", icon: "🥛" },
  { slug: "mosla", nameBn: "মসলা", icon: "🌶️" },
];

export function getCategoryBySlug(slug: string): Category | null {
  return CATEGORIES.find((c) => c.slug === slug) || null;
}

export interface ProductMarket {
  market: string;
  division: string;
  min: number;
  max: number;
}

export interface Product {
  id: number;
  slug?: string;
  nameBn: string;
  nameEn?: string;
  category: string;
  categoryNameBn?: string;
  categoryBn?: string;
  categoryIcon?: string;
  today: number;
  yesterday: number;
  lastWeek?: number;
  lastMonth?: number;
  unit: string;
  image: string;
  change: {
    amount?: number;
    pct: number;
    dir: "up" | "down" | "flat";
  };
  markets?: ProductMarket[];
}

const BASE_URL = "https://api.abcz.workers.dev/api/bazardor";

export async function getAllProducts(): Promise<Product[]> {
  try {
    const isServer = typeof window === "undefined";

    let res: Response;
    if (isServer) {
      // Server-side: fetch directly with Next.js caching
      res = await fetch(`${BASE_URL}/products`, {
        next: { revalidate: 60 },
      } as RequestInit);
    } else {
      // Client-side: proxy through local API route to avoid CORS
      res = await fetch("/api/products");
    }

    if (!res.ok) throw new Error("Failed to fetch");
    const json = await res.json();
    if (Array.isArray(json)) return json;
    if (json && Array.isArray(json.data)) return json.data;
    return [];
  } catch (err) {
    console.error("API error:", err);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getAllProducts();
  return products.find((p) => p.slug === slug || String(p.id) === slug) || null;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((p) => p.category === category);
}
