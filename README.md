# 🛒 বাজার দর — BazarDor

> প্রয়োজনীয় পণ্যের দাম এক নজরে | Bangladesh Daily Market Price Tracker

---

## 📖 Short Description

**বাজার দর (BazarDor)** is a real-time Bangladeshi market price tracking web application that displays the daily prices of essential commodities — rice, lentils, oil, vegetables, fish, meat, eggs/dairy, and spices — sourced from multiple markets across all divisions of Bangladesh. Built with a Bengali-first UI, it features price change indicators, market comparisons, and user authentication.

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| **Next.js** (App Router) | Full-stack framework, SSR, dynamic routing |
| **TypeScript** | Type safety across the entire codebase |
| **Tailwind CSS** | Utility-first styling + custom design system |
| **BetterAuth** | Authentication (email/password + Google + GitHub OAuth) |
| **MongoDB** | User data persistence via BetterAuth MongoDB adapter |
| **React Hot Toast** | Toast notifications for auth events |
| **Hind Siliguri** (Google Fonts) | Bengali-optimized typography |

---

## ✨ 5 Key Features

1. **🏷️ Real-Time Price Ticker** — An infinite scrolling marquee at the top of the page shows all product prices with ▲/▼ change indicators, providing a live-market feel.

2. **📊 Price Risers & Fallers Dashboard** — The home page highlights the top 6 products whose prices increased today (▲) and top 6 that decreased (▼), giving users an at-a-glance market summary.

3. **🗺️ Division-wise Market Comparison** — Each product detail page (protected route) shows prices from 12 different markets grouped by Bangladesh's 8 administrative divisions (ঢাকা, চট্টগ্রাম, রাজশাহী, etc.).

4. **🔐 Full Authentication System** — Supports email/password registration/login plus Google and GitHub OAuth via BetterAuth, with toast notifications on all auth events and protected routes that redirect with return URL.

5. **📱 Responsive Bengali-First UI** — The entire application is built with a Bengali typography system (Hind Siliguri font), Bengali numeral conversion (১২৩৪৫), and responsive grids that collapse gracefully from 3-column desktop to 1-column mobile.

---

