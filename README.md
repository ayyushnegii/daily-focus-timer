# Daily Focus Timer

A Pomodoro-style focus timer I use daily to manage work sessions. Built with Next.js + Tailwind CSS, featuring a dark neon UI and local session tracking.

![Daily Focus Timer](/public/og-image.png)

## Features

- 🕒 **Pomodoro (25min), Short Break (5min), Long Break (15min)** modes
- ⚡ **Neon dark theme** optimized for low-light work
- 💾 **Local browser storage** for completed session tracking
- 🔔 **Browser notifications** + audible alarm when timer completes
- 📊 **Comprehensive stats**: Today, This Week, Total, Streak
- 🎯 **Daily goal** with progress bar
- ⌨️ **Keyboard shortcuts**: Space, R, 1/2/3, S
- 🔊 **Sound settings**: Volume + 4 sound choices + mute
- 📱 **Mobile responsive** design
- 💫 **Pulsing neon animation** when timer running
- 🔄 **Timer persistence** (survives page refresh)
- 🎨 **Custom durations** (1-60 minutes per mode)
- 🔄 **Auto-switch** to break after pomodoro (long break every 4th)

## Tech Stack

- Next.js 16 (App Router)
- Tailwind CSS v4
- TypeScript
- LocalStorage (no backend needed)
- Browser Notification API
- HTML5 Audio API

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Local Development

```bash
# Clone the repository
git clone https://github.com/ayyushnegii/daily-focus-timer.git
cd daily-focus-timer

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the timer.

### Build for Production

```bash
npm run build
npm start
```

## Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ayyushnegii/daily-focus-timer)

Or manually:

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import `ayyushnegii/daily-focus-timer`
5. Click "Deploy"

The `vercel.json` is already configured for instant deployment.

### Environment Variables

No environment variables required - everything runs client-side with localStorage!

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Start/Pause timer |
| `R` | Reset timer |
| `1` | Switch to Pomodoro mode |
| `2` | Switch to Short Break |
| `3` | Switch to Long Break |
| `S` | Skip break (when in break mode) |

## Dogfood Promise

This isn't a tutorial project — I actually use this daily to track my focus sessions. All data is stored locally in your browser, no mock data.

## Author

**Ayush Negi**
- Portfolio: [ayyushportfolio.vercel.app](https://ayyushportfolio.vercel.app)
- GitHub: [@ayyushnegii](https://github.com/ayyushnegii)
- LinkedIn: [ayush-negi](https://linkedin.com/in/ayush-negi)

## License

MIT License - feel free to fork and customize for your own daily use!

---

**Status**: ✅ Production Ready | 🚀 Deploy Instantly | 💻 Use Daily
