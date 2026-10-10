import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "পেজ পাওয়া যায়নি — বাজার দর",
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-10 px-4 text-center">
      <div className="text-8xl mb-4">🛒</div>
      <h1 className="text-3xl font-extrabold text-[#1a1a1a] mb-2">৪০৪</h1>
      <h2 className="text-xl font-semibold text-[#555] mb-3">পেজটি পাওয়া যায়নি</h2>
      <p className="text-[15px] text-[#888] max-w-[380px] leading-relaxed mb-7">
        আপনি যে পেজটি খুঁজছেন সেটি বিদ্যমান নেই বা সরিয়ে নেওয়া হয়েছে।
      </p>
      <Link
        href="/"
        id="go-home-btn"
        className="bg-[#1a7a3c] text-white px-7 py-3 rounded-lg font-bold text-[15px] no-underline inline-flex items-center gap-2 shadow-[0_4px_14px_rgba(26,122,60,0.3)] hover:bg-[#155f30] transition-colors"
      >
        🏠 হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}
