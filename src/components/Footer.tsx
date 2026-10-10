export default function Footer() {
  return (
    <footer className="bg-[#FAFCFA] border-t border-[#E1E8E1] mt-10">
      <div className="max-w-[1100px] mx-auto px-4 py-5 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-[#1D271F] font-medium">
          বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </div>
        <div className="text-xs text-[#1D271F] max-w-[420px] text-right">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </div>
      </div>
    </footer>
  );
}
