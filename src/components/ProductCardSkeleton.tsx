export default function ProductCardSkeleton() {
  return (
    <div style={{ background: "white", borderRadius: 12, padding: "16px", border: "1px solid #eaeaea" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
        <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 8, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ height: 16, marginBottom: 6, width: "70%" }} />
          <div className="skeleton" style={{ height: 12, width: "40%" }} />
        </div>
      </div>
      <div style={{ borderTop: "1px solid #f5f5f5", paddingTop: 10 }}>
        <div className="skeleton" style={{ height: 11, width: "40%", marginBottom: 6 }} />
        <div className="skeleton" style={{ height: 20, width: "55%" }} />
      </div>
    </div>
  );
}
