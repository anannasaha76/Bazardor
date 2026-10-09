export function toBengaliDigits(num: number | string): string {
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(num).replace(/\d/g, (d) => bengaliDigits[parseInt(d)]);
}

export function formatPrice(price: number | string): string {
  if (price === undefined || price === null || price === "") return "০";
  return toBengaliDigits(price);
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
