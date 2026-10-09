"use client";

import { Suspense, useState } from "react";
import { signIn } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("ইমেইল ও পাসওয়ার্ড দিন");
      return;
    }
    setLoading(true);
    try {
      const res = await signIn.email({ email, password, callbackURL: redirectUrl });
      if (res.error) {
        toast.error("লগইন ব্যর্থ। ইমেইল বা পাসওয়ার্ড সঠিক নয়।");
      } else {
        toast.success("সফলভাবে লগইন হয়েছে!");
        router.push(redirectUrl);
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
      await signIn.social({ provider, callbackURL: redirectUrl });
    } catch {
      toast.error("সামাজিক লগইনে সমস্যা হয়েছে।");
      setSocialLoading(null);
    }
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 16px", background: "var(--bg)" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1a1a1a", marginBottom: 6 }}>সাইন ইন</h1>
        <p style={{ fontSize: 14, color: "#888" }}>বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখাতে আকাউন্টে ঢুকুন।</p>
      </div>

      <div style={{ background: "white", borderRadius: 16, padding: "32px", width: "100%", maxWidth: 440, border: "1px solid #eaeaea", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 6 }}>ইমেইল</label>
            <input
              id="signin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="form-input"
              autoComplete="email"
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 6 }}>পাসওয়ার্ড</label>
            <input
              id="signin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="কমপক্ষে ৮ অক্ষর"
              className="form-input"
              autoComplete="current-password"
            />
          </div>
          <button id="signin-submit" type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 16, height: 16, border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                লগইন হচ্ছে...
              </span>
            ) : "সাইন ইন"}
          </button>
        </form>

        <div className="divider-text" style={{ margin: "20px 0" }}>অথবা</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button id="google-signin" onClick={() => handleSocial("google")} className="btn-outline" disabled={!!socialLoading}>
            {socialLoading === "google" ? "সংযুক্ত হচ্ছে..." : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google দিয়ে চালিয়ে যান
              </>
            )}
          </button>
          <button id="github-signin" onClick={() => handleSocial("github")} className="btn-outline" disabled={!!socialLoading}>
            {socialLoading === "github" ? "সংযুক্ত হচ্ছে..." : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                GitHub দিয়ে চালিয়ে যান
              </>
            )}
          </button>
        </div>
        <p style={{ textAlign: "center", fontSize: 14, color: "#888", marginTop: 20 }}>
          আকাউন্ট নেই?{" "}
          <Link href="/signup" style={{ color: "#1a7a3c", fontWeight: 600, textDecoration: "none" }}>সাইন আপ করুন</Link>
        </p>
      </div>

      <Link href="/" style={{ marginTop: 20, fontSize: 13, color: "#888", textDecoration: "none" }}>← হোম পেজে ফিরে যান</Link>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}><div className="skeleton" style={{ width: 440, height: 400, borderRadius: 16 }} /></div>}>
      <SignInContent />
    </Suspense>
  );
}
