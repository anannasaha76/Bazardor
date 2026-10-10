"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { useBanglaDate } from "@/lib/utils";
import { CATEGORIES as INITIAL_CATEGORIES, getAllCategories, Category } from "@/lib/api";
import { Suspense, useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

function NavbarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const banglaDate = useBanglaDate();
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    getAllCategories().then((data) => {
    if (isMounted && data && data.length > 0) {
        setCategories(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
    if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeCategory = categories.find((c) => pathname.startsWith(`/category/${c.slug}`))?.slug;

  const handleSignOut = async () => {
    await signOut();
    toast.success("সফলভাবে সাইন আউট হয়েছেন");
    router.push("/");
    setProfileOpen(false);
  };

  return (
    <header className="bg-[#FAFCFA] border-b border-[#e8ede8] sticky top-0 z-[100] shadow-[0_1px_8px_rgba(0,0,0,0.06)]">
      <div className="max-w-[1100px] mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline">
        <div className="w-11 h-11 bg-[#05893E] rounded-[14px] shrink-0 flex items-center justify-center">
          <Image
            src="/logo-icon.png"
            alt="বাজার দর"
            width={26}
            height={26}
            unoptimized
            className="w-[15px] h-[15px] object-contain"
          />
        </div>
          <div>
            <div className="font-bold text-lg text-[#1D271F] leading-tight">বাজার দর</div>
            <div className="text-[11px] text-[#1D271F] leading-none">{banglaDate}</div>
          </div>
        </Link>

        <div className="flex items-center gap-2.5">
          {session?.user ? (
            <div className="relative" ref={profileRef}>
              <button
                id="profile-btn"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 bg-transparent border-0 cursor-pointer px-2.5 py-1.5 rounded-lg transition-colors hover:bg-[#f0f2f0]"
              >
                <div className="w-[34px] h-[34px] rounded-full bg-[#1a7a3c] flex items-center justify-center text-white font-bold text-sm">
                  {session.user.name?.charAt(0) || "U"}
                </div>
                <span className="font-semibold text-sm text-[#1a1a1a]">{session.user.name?.split(" ")[0]}</span>
                <span className="text-xs text-[#888]">▾</span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-[calc(100%+10px)] bg-white border border-[#e5e7eb] rounded-[20px] shadow-[0_12px_35px_-6px_rgba(0,0,0,0.1),0_4px_14px_-2px_rgba(0,0,0,0.04)] min-w-[260px] p-[22px_24px] z-[200]">
                  <div className="mb-5">
                    <div className="font-bold text-base text-[#1D271F] leading-tight">
                      {session.user.name || "User Name"}
                    </div>
                    <div className="text-sm text-[#1D271F] mt-1">
                      {session.user.email || "user@example.com"}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3.5">
                    <Link
                      href="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 text-[15px] font-medium text-[#1D271F] no-underline transition-opacity hover:opacity-75"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#4a7bb0" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                      <span>আমার প্রোফাইল</span>
                    </Link>

                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2.5 text-[15px] font-medium text-[#D03739] bg-transparent border-0 cursor-pointer p-0 text-left transition-opacity hover:opacity-75"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 14L4 9l5-5" />
                        <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
                      </svg>
                      <span>সাইন আউট</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/signin"
                id="signin-btn"
                className="px-4 py-2 rounded-lg font-semibold text-sm text-[#1D271F] no-underline transition-colors"
              >
                সাইন ইন
              </Link>
              <Link
                href="/signup"
                id="signup-btn"
                className="px-4 py-2 rounded-lg font-semibold text-sm text-[#F3FBF4] bg-[#047F39] no-underline transition-colors"
              >
                সাইন আপ
              </Link>
            </>
          )}
          <button
            id="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            className="hidden bg-transparent border-0 cursor-pointer p-1.5 mobile-menu-toggle"
          >
            ☰
          </button>
        </div>
      </div>
      <div className="border-t border-[#e8ede8]">
        <div className="max-w-[1100px] mx-auto px-4">
          <nav className="flex items-center gap-1.5 overflow-x-auto py-2 [scrollbar-width:none]">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                id={`nav-${cat.slug}`}
                className={`flex items-center gap-1.5 px-3 py-1.25 rounded-full text-sm font-medium no-underline whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat.slug
                    ? "bg-[#047F39] text-[#F3FBF4]"
                    : "text-[#1D271F] hover:bg-[#e8f5ed]"
                }`}
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
    <Suspense fallback={<header className="h-[100px] bg-white border-b border-[#e8ede8]" />}>
      <NavbarContent />
    </Suspense>
  );
}
