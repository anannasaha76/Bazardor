"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { getBanglaDate } from "@/lib/utils";
import { Suspense, useState, useEffect } from "react";

const CATEGORIES = [
  { slug: "chal", nameBn: "চাল", icon: "🍚" },
  { slug: "dal", nameBn: "ডাল", icon: "🫘" },
  { slug: "tel", nameBn: "তেল", icon: "🛢️" },
  { slug: "sobji", nameBn: "সবজি", icon: "🥬" },
  { slug: "mach", nameBn: "মাছ", icon: "🐟" },
  { slug: "mangsho", nameBn: "মাংস", icon: "🍗" },
  { slug: "dim-dui", nameBn: "ডিম-দুধ", icon: "🥛" },
  { slug: "mosla", nameBn: "মসলা", icon: "🌶️" },
];

function NavbarContent() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [banglaDate, setBanglaDate] = useState("");

  useEffect(() => {
    setBanglaDate(getBanglaDate());
  }, []);

  const activeCategory = CATEGORIES.find((c) => pathname.startsWith(`/category/${c.slug}`))?.slug;

  return (
    <header style={{ background: "white", borderBottom: "1px solid #e8ede8", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <Image src="/logo-icon.png" alt="Logo" width={36} height={36} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, color: "#1a1a1a" }}>বাজার দর</div>
            <div style={{ fontSize: 11, color: "#888" }}>{banglaDate}</div>
          </div>
        </Link>

        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/signin" style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #e0e0e0", textDecoration: "none", color: "#333", fontSize: 14, fontWeight: 600 }}>
            সাইন ইন
          </Link>
          <Link href="/signup" style={{ padding: "8px 16px", borderRadius: 8, background: "#1a7a3c", color: "white", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
            সাইন আপ
          </Link>
        </div>
      </div>
      <div style={{ borderTop: "1px solid #f0f2f0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "8px 16px", display: "flex", gap: 8, overflowX: "auto" }}>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: 14,
                textDecoration: "none",
                background: activeCategory === cat.slug ? "#1a7a3c" : "#f5f5f5",
                color: activeCategory === cat.slug ? "white" : "#333",
                whiteSpace: "nowrap"
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.nameBn}</span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<header style={{ height: "90px", background: "white" }} />}>
      <NavbarContent />
    </Suspense>
  );
}
