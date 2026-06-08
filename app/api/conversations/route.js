import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Conversation from '@/lib/models/Conversation';
import User from '@/lib/models/User';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Fetch conversations sorted by updatedAt desc, return only key fields
    const conversations = await Conversation.find({ userId: session.user.id })
      .select('title model updatedAt')
      .sort({ updatedAt: -1 });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Conversations GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let { model } = await req.json().catch(() => ({}));

    await connectDB();

    if (!model) {
      // Fallback to user default model setting
      const user = await User.findById(session.user.id).select('settings');
      model = user?.settings?.selectedModel || 'openrouter/free';
    }

    const conversation = await Conversation.create({
      userId: session.user.id,
      title: 'New Chat',
      model: model,
      messages: [],
    });

    return NextResponse.json(conversation, { status: 201 });
  } catch (error) {
    console.error('Conversations POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
