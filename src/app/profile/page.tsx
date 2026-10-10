"use client";

import { useSession, signOut, authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function ProfileNameForm({ initialName }: { initialName: string }) {
  const [name, setName] = useState(initialName);
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("নাম দিন");
      return;
    }

    setUpdating(true);

    try {
      const res = await authClient.updateUser({ name: name.trim() });

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

  return (
    <div className="bg-[#FAFCFA] rounded-2xl p-5 md:p-6 border border-[#E3EBE4]">
      <h2 className="text-sm font-bold text-[#1D271F] mb-8">
        তথ্য
      </h2>

      <form onSubmit={handleUpdate} className="flex flex-col gap-3.5 px-1 md:px-3">
        <div>
          <label
            htmlFor="profile-name"
            className="block text-xs font-semibold text-[#1D271F] mb-1.5"
          >
            নাম
          </label>

          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-[#E0E8E1] rounded-lg text-sm text-[#1D271F] bg-transparent outline-none focus:border-[#05893E] focus:ring-2 focus:ring-[#05893E]/10 transition-colors"
          />
        </div>

        <button
          id="update-btn"
          type="submit"
          disabled={updating}
          className="w-full bg-[#05893E] text-[#F3FBF4] py-2.5 px-5 rounded-lg font-semibold text-sm border-0 cursor-pointer hover:bg-[#155F30] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {updating ? "আপডেট হচ্ছে..." : "আপডেট"}
        </button>
      </form>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session) {
      toast.error("প্রোফাইল দেখতে লগইন করুন");
      router.push("/signin?redirect=/profile");
    }
  }, [session, isPending, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("সফলভাবে সাইন আউট হয়েছেন");
      router.push("/");
    } catch {
      toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
    }
  };

  if (isPending) {
    return (
      <main className="min-h-screen bg-[#F0F5F0]">
        <div className="max-w-[1100px] mx-auto px-4 py-8">
          <div className="animate-pulse bg-[#E1EAE2] h-7 w-[200px] mb-2 rounded" />
          <div className="animate-pulse bg-[#E1EAE2] h-4 w-[280px] mb-6 rounded" />
          <div className="animate-pulse bg-white border border-[#E3EBE4] h-24 rounded-2xl" />
        </div>
      </main>
    );
  }

  if (!session) return null;

  return (
    <main className="min-h-screen bg-[#F0F5F0]">
      <div className="max-w-[680px] mx-auto px-4 py-6 md:py-8">
        <h1 className="text-xl md:text-2xl font-extrabold text-[#1D271F] mb-1">
          আমার প্রোফাইল
        </h1>

        <p className="text-xs text-[#1D271F]/65 mb-6">
          আপনার আকাউন্টের তথ্য এখানে দেখুন।
        </p>
        <div className="bg-[#FAFCFA] rounded-2xl p-4 md:p-5 border border-[#E3EBE4] flex items-center justify-between gap-4 flex-wrap mb-5">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-16 h-16 rounded-xl bg-[#05893E] border border-[#D4EAD9] flex items-center justify-center text-2xl text-white font-extrabold shrink-0">
              {session.user.name?.charAt(0) || "U"}
            </div>

            <div className="min-w-0">
              <div className="font-bold text-base text-[#1D271F] break-words">
                {session.user.name}
              </div>

              <div className="text-sm text-[#1D271F]/65 break-all">
                {session.user.email}
              </div>
            </div>
          </div>

          <button
            id="signout-btn"
            onClick={handleSignOut}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#D03739] bg-transparent border border-[#D03739] cursor-pointer flex items-center gap-1.5 transition-colors hover:bg-[#FFF5F5] whitespace-nowrap"
          >
            <span aria-hidden="true">↪</span>
            সাইন আউট
          </button>
        </div>

        <ProfileNameForm
          key={session.user.id}
          initialName={session.user.name || ""}
        />
      </div>
    </main>
  );
}

