"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { getBanglaDate } from "@/lib/utils";
import { Suspense, useState, useEffect } from "react";
import toast from "react-hot-toast";

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
  const router = useRouter();
  const { data: session } = useSession();
  const [banglaDate, setBanglaDate] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    setBanglaDate(getBanglaDate());
  }, []);

  const activeCategory = CATEGORIES.find((c) => pathname.startsWith(`/category/${c.slug}`))?.slug;

  const handleSignOut = async () => {
    await signOut();
    toast.success("সফলভাবে সাইন আউট হয়েছেন");
    router.push("/");
    setProfileOpen(false);
  };

  return (
    <header style={{ background: "white", borderBottom: "1px solid #e8ede8", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
      <div className="container-main" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px" }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, overflow: "hidden", background: "#e8f5ed", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Image src="/logo-icon.png" alt="বাজার দর" width={36} height={36} style={{ objectFit: "contain" }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, color: "#1a1a1a", lineHeight: 1.1 }}>বাজার দর</div>
            <div style={{ fontSize: 11, color: "#888", lineHeight: 1 }}>{banglaDate}</div>
          </div>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {session?.user ? (
            <div style={{ position: "relative" }}>
              <button
                id="profile-btn"
                onClick={() => setProfileOpen(!profileOpen)}
                style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: "6px 10px", borderRadius: 8, transition: "background 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f2f0")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              >
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#1a7a3c", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 15 }}>
                  {session.user.name?.charAt(0) || "U"}
                </div>
                <span style={{ fontWeight: 600, fontSize: 14, color: "#1a1a1a" }}>{session.user.name?.split(" ")[0]}</span>
                <span style={{ fontSize: 12, color: "#888" }}>▾</span>
              </button>

              {profileOpen && (
                <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", background: "white", border: "1px solid #e0e0e0", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", minWidth: 160, zIndex: 200, overflow: "hidden" }}>
                  <Link href="/profile" onClick={() => setProfileOpen(false)} style={{ display: "block", padding: "10px 16px", fontSize: 14, color: "#1a1a1a", textDecoration: "none", borderBottom: "1px solid #f0f0f0" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f9f9f9")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                  >
                    👤 আমার প্রোফাইল
                  </Link>
                  <button onClick={handleSignOut} style={{ display: "block", width: "100%", padding: "10px 16px", fontSize: 14, color: "#e53e3e", textAlign: "left", background: "none", border: "none", cursor: "pointer" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fff5f5")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                  >
                    ⇒ সাইন আউট
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/signin" id="signin-btn" style={{ padding: "8px 16px", borderRadius: 8, fontWeight: 600, fontSize: 14, color: "#1a1a1a", textDecoration: "none", border: "1.5px solid #e0e0e0", transition: "border-color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#1a7a3c")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e0e0e0")}
              >
                সাইন ইন
              </Link>
              <Link href="/signup" id="signup-btn" style={{ padding: "8px 16px", borderRadius: 8, fontWeight: 600, fontSize: 14, color: "white", background: "#1a7a3c", textDecoration: "none", transition: "background 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#155f30")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#1a7a3c")}
              >
                সাইন আপ
              </Link>
            </>
          )}
          <button
            id="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 6 }}
            className="mobile-menu-toggle"
          >
            ☰
          </button>
        </div>
      </div>
      <div style={{ borderTop: "1px solid #f0f2f0" }}>
        <div className="container-main" style={{ padding: "0 16px" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 4, overflowX: "auto", padding: "8px 0", scrollbarWidth: "none" }}>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                id={`nav-${cat.slug}`}
                className={activeCategory === cat.slug ? "nav-link-active" : ""}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "5px 12px", borderRadius: 20, fontSize: 14, fontWeight: 500,
                  color: activeCategory === cat.slug ? "white" : "#333",
                  textDecoration: "none", whiteSpace: "nowrap", transition: "all 0.2s",
                  background: activeCategory === cat.slug ? "#1a7a3c" : "transparent",
                }}
                onMouseEnter={(e) => { if (activeCategory !== cat.slug) { e.currentTarget.style.background = "#e8f5ed"; e.currentTarget.style.color = "#1a7a3c"; } }}
                onMouseLeave={(e) => { if (activeCategory !== cat.slug) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#333"; } }}
              >
                <span>{cat.icon}</span>
                <span>{cat.nameBn}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<header style={{ height: "100px", background: "white", borderBottom: "1px solid #e8ede8" }} />}>
      <NavbarContent />
    </Suspense>
  );
}
