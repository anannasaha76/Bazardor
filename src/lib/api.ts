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
    const res = await fetch(`${BASE_URL}/products`, {
      next: { revalidate: 60 }, 
    });
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
