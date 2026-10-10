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

const BASE_URL = "https://openapi.programming-hero.com/api/bazardor";

export async function getAllProducts(): Promise<Product[]> {
  try {
    const isServer = typeof window === "undefined";

    let res: Response;
    if (isServer) {
      
      res = await fetch(`${BASE_URL}/products`, {
        next: { revalidate: 60 },
      } as RequestInit);
    } else {
      
      res = await fetch("/api/products");
      if (!res.ok) {
        res = await fetch(`${BASE_URL}/products`);
      }
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
  return products.filter(
    (p) =>
      p.category === category ||
      (category === "dim-dudh" && p.category === "dim-dui") ||
      (category === "dim-dui" && p.category === "dim-dudh")
  );
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    const isServer = typeof window === "undefined";
    const url = `${BASE_URL}/categories`;
    const res = await fetch(url, isServer ? ({ next: { revalidate: 60 } } as RequestInit) : undefined);

    if (res.ok) {
      const json = await res.json();
      const data = Array.isArray(json) ? json : json?.data;
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn("Categories API endpoint fetch failed, falling back to products derivation:", err);
  }

  try {
    const products = await getAllProducts();
    if (products && products.length > 0) {
      const map = new Map<string, Category>();
      products.forEach((p) => {
        if (p.category && !map.has(p.category)) {
          const defaultCat = CATEGORIES.find((c) => c.slug === p.category);
          map.set(p.category, {
            slug: p.category,
            nameBn: p.categoryNameBn || p.categoryBn || defaultCat?.nameBn || p.category,
            icon: p.categoryIcon || defaultCat?.icon || "🛒",
          });
        }
      });
      if (map.size > 0) return Array.from(map.values());
    }
  } catch (err) {
    console.error("Error deriving categories from products:", err);
  }

  return CATEGORIES;
}
