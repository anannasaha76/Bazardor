"use client";

import { useState } from "react";
import { signUp, signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast.error("সব ঘর পূরণ করুন");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("পাসওয়ার্ড দুটি মিলছে না");
      return;
    }
    if (password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
      return;
    }

    setLoading(true);
    try {
      const res = await signUp.email({ name, email, password, callbackURL: "/" });
      if (res.error) {
        toast.error(res.error.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে।");
      } else {
        toast.success("আকাউন্ট তৈরি হয়েছে! লগইন পেজে যাচ্ছেন...");
        setTimeout(() => router.push("/signin"), 1500);
      }
    } catch {
      toast.error("একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = async (provider: "google" | "github") => {
    setSocialLoading(provider);
    try {
      await signIn.social({ provider, callbackURL: "/" });
    } catch {
      toast.error("সামাজিক লগইনে সমস্যা হয়েছে।");
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-10 px-4 bg-[#f0f2f0]">
      <div className="text-center mb-7">
        <h1 className="text-2xl font-extrabold text-[#1D271F] mb-1.5">অ্যাকাউন্ট তৈরি করুন</h1>
        <p className="text-sm text-[#1D271F]/70">বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।</p>
      </div>
      <div className="bg-white rounded-2xl p-8 w-full max-w-[440px] border border-[#eaeaea] shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
          <div>
            <label className="block text-sm font-semibold text-[#1D271F] mb-1.5">নাম</label>
            <input
              id="signup-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="যেমন: রহিম উদ্দিন"
              className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-lg text-sm bg-white outline-none focus:border-[#1a7a3c] focus:ring-2 focus:ring-[#1a7a3c]/10 transition-colors"
              autoComplete="name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1D271F] mb-1.5">ইমেইল</label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-lg text-sm bg-white outline-none focus:border-[#1a7a3c] focus:ring-2 focus:ring-[#1a7a3c]/10 transition-colors"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1D271F] mb-1.5">পাসওয়ার্ড</label>
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="কমপক্ষে ৮ অক্ষর"
              className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-lg text-sm bg-white outline-none focus:border-[#1a7a3c] focus:ring-2 focus:ring-[#1a7a3c]/10 transition-colors"
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1D271F] mb-1.5">পাসওয়ার্ড নিশ্চিত করুন</label>
            <input
              id="signup-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="আবার লিখুন"
              className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-lg text-sm bg-white outline-none focus:border-[#1a7a3c] focus:ring-2 focus:ring-[#1a7a3c]/10 transition-colors"
              autoComplete="new-password"
            />
          </div>

          <button
            id="signup-submit"
            type="submit"
            className="w-full bg-[#05893E] text-[#F3FBF4] py-2.5 px-5 rounded-lg font-semibold text-sm border-0 cursor-pointer hover:bg-[#155f30] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                তৈরি হচ্ছে...
              </span>
            ) : "আকাউন্ট তৈরি করুন"}
          </button>
        </form>

        <div className="flex items-center gap-3 text-xs text-[#1D271F] my-5 before:flex-1 before:h-px before:bg-[#e0e0e0] after:flex-1 after:h-px after:bg-[#e0e0e0]">অথবা</div>

        <div className="flex flex-row gap-2.5">
          <button
            id="google-signup"
            onClick={() => handleSocial("google")}
            className="flex-1 bg-transparent border border-[#e0e0e0] text-[#1D271F] py-2.5 px-3 rounded-lg font-medium text-sm cursor-pointer hover:border-[#047F39] hover:bg-[#f0f9f4] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            disabled={!!socialLoading}
          >
            {socialLoading === "google" ? "সংযুক্ত..." : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google দিয়ে চালিয়ে যান
              </>
            )}
          </button>
          <button
            id="github-signup"
            onClick={() => handleSocial("github")}
            className="flex-1 bg-transparent border border-[#e0e0e0] text-[#1D271F] py-2.5 px-3 rounded-lg font-medium text-sm cursor-pointer hover:border-[#047F39] hover:bg-[#f0f9f4] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            disabled={!!socialLoading}
          >
            {socialLoading === "github" ? "সংযুক্ত..." : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                GitHub দিয়ে চালিয়ে যান
              </>
            )}
          </button>
        </div>

        <p className="text-center text-sm text-[#1D271F] mt-5">
          আকাউন্ট আছে?{" "}
          <Link href="/signin" className="text-[#05893E] font-semibold no-underline hover:underline">সাইন ইন করুন</Link>
        </p>
      </div>

      <Link href="/" className="mt-5 text-xs text-[#1D271F]/60 no-underline">← হোম পেজে ফিরে যান</Link>
    </div>
  );
}
