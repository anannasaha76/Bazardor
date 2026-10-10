import { NextResponse } from "next/server";

const BASE_URL = "https://openapi.programming-hero.com/api/bazardor";

export async function GET() {
  try {
    const res = await fetch(`${BASE_URL}/products`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch products" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
