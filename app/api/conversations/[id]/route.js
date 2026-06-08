import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions, resolveSessionUserId } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Conversation from '@/lib/models/Conversation';

export async function GET(req, context) {
  try {
    const session = await getServerSession(authOptions);
    const userId = await resolveSessionUserId(session);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    await connectDB();
    const conversation = await Conversation.findOne({
      _id: id,
      userId,
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Conversation GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    const session = await getServerSession(authOptions);
    const userId = await resolveSessionUserId(session);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();
    await connectDB();

    const conversation = await Conversation.findOne({
      _id: id,
      userId,
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Update title if provided
    if (body.title !== undefined) {
      conversation.title = body.title;
    }

    // Update model if provided
    if (body.model !== undefined) {
      conversation.model = body.model;
    }

    // Update messages if provided
    if (body.messages !== undefined) {
      conversation.messages = body.messages;
    }

    await conversation.save();

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Conversation PUT error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    const session = await getServerSession(authOptions);
    const userId = await resolveSessionUserId(session);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    await connectDB();

    const result = await Conversation.deleteOne({
      _id: id,
      userId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Conversation DELETE error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
