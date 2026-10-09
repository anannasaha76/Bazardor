export default function Footer() {
  return (
    <footer style={{ background: "white", borderTop: "1px solid #e8ede8", marginTop: 40 }}>
      <div className="container-main" style={{ padding: "20px 16px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ fontSize: 14, color: "#444", fontWeight: 500 }}>
          বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </div>
        <div style={{ fontSize: 13, color: "#888", maxWidth: 420, textAlign: "right" }}>
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </div>
      </div>
    </footer>
  );
}
