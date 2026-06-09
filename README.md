# OddAI Chatbot

A premium, production-ready AI chatbot assistant built with Next.js 16, React 19, and OpenRouter free-tier models. Features a Claude-like conversational UI with real-time streaming, markdown rendering, and a warm neutral design system with purple accents.

## Features

- **Claude-like UI** — Warm neutral color palette (#F5F4EF backgrounds) with purple accents (#7F77DD), clean typography scale (11px–22px, weights 400/500), and micro-animations throughout
- **Real-time streaming** — Server-Sent Events streaming from OpenRouter with abort controller support
- **Full markdown rendering** — Code blocks with syntax highlighting and language labels, tables, blockquotes, lists, inline code with monospace font
- **Conversation management** — Create, rename, delete conversations grouped by Today/Yesterday/Last 7 days/Earlier
- **Authentication** — NextAuth v4 with Credentials, Google, and GitHub OAuth providers
- **Custom API keys** — Users can provide their own OpenRouter API key in Settings
- **Theme support** — Light and dark themes with system preference detection
- **Responsive design** — Mobile-first with 360px, 768px, and 1024px+ breakpoints. Sidebar becomes overlay drawer on mobile
- **Accessibility** — `prefers-reduced-motion` support, proper ARIA labels, keyboard navigation
- **Typing indicator** — Animated 3-dot bouncing indicator during AI response generation

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

## Design System

| Token | Light | Dark |
|-------|-------|------|
| Page bg | #F5F4EF | #1A1916 |
| Sidebar bg | #EEECE5 | #141412 |
| Surface | #FFFFFF | #222220 |
| Input bg | #FFFFFF | #2A2926 |
| User bubble | #2D2C2A | #EEEDFE |
| Text primary | #1A1916 | #F0EEE8 |
| Text secondary | #5C5A55 | #A8A69E |
| Text tertiary | #9A9890 | #6A6862 |
| Accent | #7F77DD | #7F77DD |
| Accent dark | #534AB7 | #AFA9EC |

Typography: 11px captions → 13px body → 15px chat → 16px h3 → 19px h2 → 22px h1. Weights: 400/500 only. Monospace for code.

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally on port 27017 (or update `MONGODB_URI` in `.env.local`)

### Installation

```bash
npm install
```

### Environment Variables

Create `.env.local` in the project root:

```env
MONGODB_URI=mongodb://localhost:27017/oddai
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# OpenRouter (required for chat)
OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). If port 3000 is in use:

```cmd
taskkill /PID <pid> /F
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
app/
├── api/
│   ├── auth/
│   │   ├── [...nextauth]/route.js   # NextAuth handlers
│   │   └── register/route.js         # Registration endpoint
│   ├── chat/route.js                  # OpenRouter streaming proxy
│   ├── conversations/
│   │   ├── route.js                   # List/create conversations
│   │   └── [id]/route.js             # Get/update/delete conversation
│   └── settings/route.js             # User settings CRUD
├── components/
│   ├── ChatArea.js                    # Message viewport + input bar
│   ├── Message.js                     # Individual message bubbles
│   ├── WelcomeScreen.js              # Empty state with suggestions
│   ├── Sidebar.js                    # Conversation history sidebar
│   ├── ModelSelector.js              # AI model dropdown
│   ├── SettingsModal.js              # Settings dialog
│   ├── ThemeToggle.js                # Light/dark toggle
│   └── ClientProviders.js            # Session + Theme context
├── guide/                            # UI design guide (step-by-step)
├── login/                            # Login page
├── register/                         # Registration page
├── globals.css                       # Design tokens + resets
├── layout.js                         # Root layout
└── page.js                           # Main chat shell
lib/
├── auth.js                           # NextAuth config + helpers
├── mongodb.js                        # Mongoose connection cache
├── models/
│   ├── User.js                       # User schema (credentials + OAuth)
│   └── Conversation.js               # Conversation schema with messages
└── models.js                         # Free model definitions
proxy.js                              # Next.js 16 middleware (auth guard)
```

## Available Models

All models use OpenRouter's free tier:

| ID | Name | Category |
|----|------|----------|
| `openrouter/free` | Auto (Best Free) | auto |
| `google/gemma-4-31b-it:free` | Gemma 4 31B | general |
| `openai/gpt-oss-120b:free` | GPT-OSS 120B | reasoning |
| `qwen/qwen3-coder:free` | Qwen3 Coder | coding |
| `nvidia/nemotron-3-super-120b-a12b:free` | Nemotron 3 Super | general |
| `z-ai/glm-4.5-air:free` | GLM 4.5 Air | general |

## License

Private project. All rights reserved.
