import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions, resolveSessionUserId } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

function getServerKeyPool() {
  const keys = [];
  if (process.env.OPENROUTER_API_KEY) keys.push(process.env.OPENROUTER_API_KEY);
  let i = 2;
  while (process.env[`OPENROUTER_API_KEY_${i}`]) {
    keys.push(process.env[`OPENROUTER_API_KEY_${i}`]);
    i++;
  }
  return keys.filter(Boolean);
}

let rrIndex = 0;

// Cache user API key per userId for 60s to avoid DB hit on every message
const userKeyCache = new Map(); // userId -> { key, expires }

async function getUserApiKey(userId) {
  const cached = userKeyCache.get(userId);
  if (cached && cached.expires > Date.now()) return cached.key;
  await connectDB();
  const user = await User.findById(userId).select('settings.customApiKey').lean();
  const key = user?.settings?.customApiKey || null;
  userKeyCache.set(userId, { key, expires: Date.now() + 60_000 });
  return key;
}

async function fetchWithRotation(requestBody, keyPool) {
  const total = keyPool.length;
  const startIndex = rrIndex % total;

  for (let attempt = 0; attempt < total; attempt++) {
    const index = (startIndex + attempt) % total;
    const apiKey = keyPool[index];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000',
        'X-Title': 'OddAI',
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      rrIndex = (index + 1) % total;
      return { response };
    }

    if (response.status === 429) {
      console.warn(`[KeyPool] Key #${index + 1} rate-limited, trying next...`);
      continue;
    }

    let errorMessage = 'OpenRouter request failed';
    try {
      const errorJson = JSON.parse(await response.text());
      errorMessage = errorJson?.error?.message || errorMessage;
    } catch (_) {}
    return { error: NextResponse.json({ error: `API Error: ${errorMessage}` }, { status: response.status }) };
  }

  return {
    error: NextResponse.json(
      { error: `All ${total} API keys have hit their daily limit. Resets at midnight UTC.` },
      { status: 429 }
    ),
  };
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const userId = await resolveSessionUserId(session);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messages, model, webSearch, reasoning } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages array' }, { status: 400 });
    }

    // Resolve API key — cached to avoid DB on every token
    const customKey = await getUserApiKey(String(userId));
    const keyPool = customKey ? [customKey] : getServerKeyPool();

    if (keyPool.length === 0) {
      return NextResponse.json(
        { error: 'No API keys configured.' },
        { status: 500 }
      );
    }

    let resolvedModel = model || 'openrouter/free';
    if (webSearch && !resolvedModel.endsWith(':online')) {
      resolvedModel = `${resolvedModel}:online`;
    }

    const requestBody = {
      model: resolvedModel,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      stream: true,
      stream_options: { include_usage: false },
      ...(reasoning ? { reasoning: { effort: 'high' } } : {}),
    };

    const result = await fetchWithRotation(requestBody, keyPool);
    if (result.error) return result.error;

    // Pipe OpenRouter stream directly — zero intermediate buffering
    return new Response(result.response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });

  } catch (error) {
    console.error('Chat route error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
