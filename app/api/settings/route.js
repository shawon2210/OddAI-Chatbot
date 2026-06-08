import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions, resolveSessionUserId } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = await resolveSessionUserId(session);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(userId).select('settings');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user.settings || {});
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    const userId = await resolveSessionUserId(session);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { theme, selectedModel, systemPrompt, customApiKey } = await req.json();

    await connectDB();
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Initialize settings if empty
    if (!user.settings) {
      user.settings = {};
    }

    // Update settings only if they are provided in body
    if (theme !== undefined) user.settings.theme = theme;
    if (selectedModel !== undefined) user.settings.selectedModel = selectedModel;
    if (systemPrompt !== undefined) user.settings.systemPrompt = systemPrompt;
    if (customApiKey !== undefined) user.settings.customApiKey = customApiKey;

    await user.save();

    return NextResponse.json({
      message: 'Settings updated successfully',
      settings: {
        theme: user.settings.theme,
        selectedModel: user.settings.selectedModel,
        systemPrompt: user.settings.systemPrompt,
        customApiKey: user.settings.customApiKey ? 'configured' : '',
      },
    });
  } catch (error) {
    console.error('Settings PUT error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
