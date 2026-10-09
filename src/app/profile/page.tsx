"use client";

import { useSession, signOut, authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [name, setName] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      toast.error("প্রোফাইল দেখতে লগইন করুন");
      router.push("/signin?redirect=/profile");
    }
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session, isPending, router]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("সফলভাবে সাইন আউট হয়েছেন");
    router.push("/");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("নাম দিন");
      return;
    }
    setUpdating(true);
    try {
      const res = await authClient.updateUser({ name });
      if (res.error) {
        toast.error("আপডেট ব্যর্থ হয়েছে");
      } else {
        toast.success("তথ্য সফলভাবে আপডেট হয়েছে!");
      }
    } catch {
      toast.error("একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setUpdating(false);
    }
  };

  if (isPending) {
    return (
      <div className="container-main" style={{ padding: "40px 16px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <div className="skeleton" style={{ width: 100, height: 100, borderRadius: "50%" }} />
        </div>
        <div className="skeleton" style={{ height: 28, width: 200, margin: "0 auto 8px" }} />
        <div className="skeleton" style={{ height: 16, width: 300, margin: "0 auto 24px" }} />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="container-main" style={{ padding: "32px 16px" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <div style={{ width: 100, height: 100, borderRadius: "50%", background: "#e8f5ed", border: "4px solid #d4ead9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, color: "#1a7a3c", fontWeight: 800 }}>
          {session.user.name?.charAt(0) || "U"}
        </div>
      </div>

      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a1a", textAlign: "center", marginBottom: 4 }}>আমার প্রোফাইল</h1>
      <p style={{ fontSize: 13, color: "#888", textAlign: "center", marginBottom: 28 }}>আপনার আকাউন্টের তথ্য এখানে দেখুন।</p>
      <div style={{ maxWidth: 520, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ background: "white", borderRadius: 14, padding: "16px 20px", border: "1px solid #eaeaea", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#1a7a3c", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 20, fontWeight: 700, flexShrink: 0 }}>
              {session.user.name?.charAt(0) || "U"}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#1a1a1a" }}>{session.user.name}</div>
              <div style={{ fontSize: 13, color: "#888" }}>{session.user.email}</div>
            </div>
          </div>
          <button
            id="signout-btn"
            onClick={handleSignOut}
            style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#e53e3e", background: "transparent", border: "1.5px solid #e53e3e", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s", whiteSpace: "nowrap" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#fff5f5"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            ⇒ সাইন আউট
          </button>
        </div>
        <div style={{ background: "white", borderRadius: 14, padding: "20px 20px", border: "1px solid #eaeaea" }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 16 }}>তথ্য</h2>
          <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 6 }}>নাম</label>
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
              />
            </div>
            <button id="update-btn" type="submit" className="btn-primary" disabled={updating}>
              {updating ? "আপডেট হচ্ছে..." : "আপডেট"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
