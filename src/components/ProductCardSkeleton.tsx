export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 border border-[#eaeaea]">
      <div className="flex items-start gap-3 mb-3">
        <div className="animate-pulse bg-[#e8ede8] w-10 h-10 rounded-lg shrink-0" />
        <div className="flex-1">
          <div className="animate-pulse bg-[#e8ede8] h-4 mb-1.5 w-[70%] rounded" />
          <div className="animate-pulse bg-[#e8ede8] h-3 w-[40%] rounded" />
        </div>
      </div>
      <div className="border-t border-[#f5f5f5] pt-2.5">
        <div className="animate-pulse bg-[#e8ede8] h-3 w-[40%] mb-1.5 rounded" />
        <div className="animate-pulse bg-[#e8ede8] h-5 w-[55%] rounded" />
      </div>
    </div>
  );
}
