# 🏋️ GAINLOG — Personal Hypertrophy Tracker

A mobile-first gym tracking app with AI coaching powered by Gemini Pro.

## Features

- 🏋️ **Workout Logging** — Log by your specific machines, with superset support
- ⏱️ **Rest Timer** — Auto-starts after each set
- 🏆 **Personal Records** — Auto-detected and badged
- 🤖 **AI Coach Hub** — 6 AI features powered by Gemini Pro (free)
  - Quick workout suggestion
  - Generate weekly plan
  - Analyse body scan progress
  - Nutrition & calorie targets
  - Plateau & deload detection
  - Body age vs real age analysis
- 🧬 **Starfit Integration** — Upload PDF body composition reports, AI extracts all metrics
- 📊 **Progress Trends** — Charts for weight, body fat, muscle over time
- 💧 **Hydration Tracker**
- 📄 **PDF Export** — AI-written progress report

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **Gemini API** (google/gemini-2.0-flash) — free with Gemini Pro
- **localStorage** — data persists on device

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/gainlog.git
cd gainlog
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 4. Add your Gemini API key
- Open the app → go to ⚙️ Setup tab
- Get your free key at [aistudio.google.com](https://aistudio.google.com)
- Paste and save — stored only on your device

## Deploy to Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Click Deploy — done!

## Install as Mobile App (PWA)

1. Open your Vercel URL in Safari (iPhone) or Chrome (Android)
2. Tap Share → **Add to Home Screen**
3. Opens full screen like a native app

## Data

All data is stored in your browser's `localStorage`. It persists across sessions as long as you don't clear your browser data. No account or server needed.

---

Built with ❤️ using Claude + Gemini
