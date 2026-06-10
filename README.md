# OddAI Chatbot

A premium, production-ready AI chatbot assistant built with **Next.js 16**, **React 19**, and **OpenRouter** free-tier models. Features a Claude-like conversational UI with real-time streaming, markdown rendering, multi-model support, and a warm neutral design system with purple accents.

![CI](https://github.com/shawon2210/OddAI-Chatbot/actions/workflows/ci.yml/badge.svg)

## Features

- **Real-time AI Streaming** — Token-by-token streaming responses with throttled rendering for smooth performance
- **Multi-Model Support** — Switch between OpenRouter models (GPT-4, Claude, Gemini, and more) via dropdown
- **Conversation Management** — Create, rename, delete, and switch between chat threads with grouped history (Today, Yesterday, Previous 7 days, etc.)
- **Rich Markdown Rendering** — Full GFM support with syntax-highlighted code blocks, tables, blockquotes, and inline code
- **File Attachments** — Attach files (text, code, images) to messages with drag-and-drop support
- **Web Search & Reasoning** — Toggle web search and extended reasoning modes per message
- **Authentication** — Email/password, Google OAuth, and GitHub OAuth via NextAuth v4
- **Dark/Light Theme** — System-persistent theme toggle with smooth transitions
- **Responsive Design** — Pixel-perfect at 360px, 768px, 1024px+, and beyond
- **Smooth Animations** — Skeleton loading states, staggered message entrances, typing indicators, and conversation switching transitions

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.7 (Turbopack) |
| UI | React 19.2.4, Client Components |
| Styling | CSS Modules, CSS Custom Properties |
| Auth | NextAuth v4.24.14 (Credentials + OAuth) |
| Database | MongoDB via Mongoose |
| AI | OpenRouter API (free-tier models) |
| Markdown | react-markdown, remark-gfm |
| Syntax | react-syntax-highlighter |
| Icons | lucide-react |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas cluster (free tier works)
- OpenRouter API key(s) — [Sign up free](https://openrouter.ai/keys)

### Local Development

```bash
# Clone the repository
git clone git@github.com:shawon2210/OddAI-Chatbot.git
cd OddAI-Chatbot

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `NEXTAUTH_SECRET` | Yes | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Yes | `http://localhost:3000` for dev |
| `OPENROUTER_API_KEY` | Yes | OpenRouter API key |
| `OPENROUTER_API_KEY_2..5` | No | Additional keys for rotation |
| `GOOGLE_CLIENT_ID` | No | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth Client Secret |
| `GITHUB_CLIENT_ID` | No | GitHub OAuth Client ID |
| `GITHUB_CLIENT_SECRET` | No | GitHub OAuth Client Secret |

See `.env.example` for full reference.

## Deploy to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fshawon2210%2FOddAI-Chatbot)

### Manual Deploy

1. Fork or clone this repository
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo
3. Add the following **Environment Variables** in Vercel dashboard:
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `NEXTAUTH_SECRET` — run `openssl rand -base64 32`
   - `NEXTAUTH_URL` — your Vercel deployment URL (e.g. `https://your-app.vercel.app`)
   - `OPENROUTER_API_KEY` — your OpenRouter API key
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (optional)
   - `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` (optional)
4. Click **Deploy** — build takes ~2 minutes

### MongoDB Atlas Setup (Free)

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) and create a free cluster
2. Create a database user and get the connection string
3. Add `0.0.0.0/0` to Network Access (allow all IPs)
4. Set the connection string as `MONGODB_URI` in Vercel env vars

## Project Structure

```
OddAI-Chatbot/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.js   # NextAuth config
│   │   │   └── register/route.js        # Registration endpoint
│   │   ├── chat/route.js                # OpenRouter streaming proxy
│   │   ├── conversations/               # CRUD for chat threads
│   │   └── settings/route.js            # User settings
│   ├── components/
│   │   ├── ChatArea.js                  # Main chat viewport + input
│   │   ├── Message.js                   # Individual message rendering
│   │   ├── Sidebar.js                   # Conversation list + profile
│   │   ├── WelcomeScreen.js             # Empty state suggestions
│   │   ├── ModelSelector.js             # AI model dropdown
│   │   ├── SettingsModal.js             # Theme/model settings
│   │   ├── ThemeToggle.js               # Dark/light toggle
│   │   └── ClientProviders.js           # Session + theme context
│   ├── page.js                          # Main app shell
│   ├── layout.js                        # Root layout + fonts
│   ├── globals.css                      # Design system + animations
│   ├── login/                           # Login page
│   ├── register/                        # Registration page
│   ├── guide/                           # Guide page
│   └── landing/                         # Landing page
├── lib/
│   ├── auth.js                          # NextAuth options + callbacks
│   ├── mongodb.js                       # Mongoose connection cache
│   ├── models.js                        # OpenRouter model definitions
│   └── models/
│       ├── User.js                      # User schema + bcrypt
│       └── Conversation.js              # Conversation schema
├── .github/workflows/ci.yml             # GitHub Actions CI
├── vercel.json                          # Vercel deployment config
├── next.config.mjs                      # Next.js config
└── .env.example                         # Environment variable reference
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Developer

**Developed by:** Shawon (shawon2210)
**GitHub:** [https://github.com/shawon2210](https://github.com/shawon2210)
**Email:** shawonshanto104141@gmail.com

## License

Private project. All rights reserved.
© 2025 Shawon. All rights reserved.
