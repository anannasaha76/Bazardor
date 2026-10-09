export default function Footer() {
  return (
    <footer style={{ marginTop: "auto", borderTop: "1px solid #e8ede8", background: "white", padding: "16px 20px" }}>
      <div className="container-main" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, fontSize: 13, color: "#718096" }}>
        <div>বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।</div>
        <div>সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।</div>
      </div>
    </footer>
  );
}
