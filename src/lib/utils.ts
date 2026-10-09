export function toBengaliDigits(num: number | string): string {
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(num).replace(/\d/g, (d) => bengaliDigits[parseInt(d)]);
}

export function formatPrice(price: number | string): string {
  if (price === undefined || price === null || price === "") return "০";
  return toBengaliDigits(price);
}

export function formatDecimalPrice(val: number): string {
  if (val === undefined || val === null || isNaN(val)) return "০ টাকা";
  if (val % 1 === 0) {
    return `${toBengaliDigits(val)} টাকা`;
  }
  return `${toBengaliDigits(val.toFixed(2))} টাকা`;
}
export function formatChange(pct: number, dir: string): string {
  if (dir === "flat") return "—০.০%";
  const absPct = Math.abs(pct);
  return `${dir === "up" ? "▲" : "▼"} ${toBengaliDigits(absPct.toFixed(1))}%`;
}
export function formatUnit(unit: string): string {
  const unitMap: Record<string, string> = {
    kg: "প্রতি কেজি",
    litre: "প্রতি লিটার",
    dozen: "প্রতি ডজন",
    piece: "প্রতি পিস",
  };
  return unitMap[unit] || unit;
}
export function getBanglaDate(): string {
  const now = new Date();
  const days = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
  const months = [
    "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
    "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর",
  ];
  const day = days[now.getDay()];
  const date = toBengaliDigits(now.getDate());
  const month = months[now.getMonth()];
  const year = toBengaliDigits(now.getFullYear());
  return `${day}, ${date} ${month}, ${year}`;
}
