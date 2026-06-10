import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import mongoose from 'mongoose';
import connectDB from './mongodb';
import User from './models/User';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter email and password');
        }

        await connectDB();
        const user = await User.findOne({ email: credentials.email.toLowerCase() });

        if (!user || user.provider !== 'credentials') {
          throw new Error('No account found with this email');
        }

        const isPasswordMatch = await user.comparePassword(credentials.password);
        if (!isPasswordMatch) {
          throw new Error('Incorrect password');
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'google' || account.provider === 'github') {
        try {
          await connectDB();
          const existingUser = await User.findOne({ email: user.email.toLowerCase() });

          if (!existingUser) {
            // Auto register user from OAuth
            await User.create({
              name: user.name || profile.name || 'User',
              email: user.email.toLowerCase(),
              image: user.image || profile.avatar_url || '',
              provider: account.provider,
              settings: {},
            });
          } else {
            // Update OAuth user image if changed
            if (user.image && existingUser.image !== user.image) {
              existingUser.image = user.image;
              await existingUser.save();
            }
          }
        } catch (error) {
          console.error('Error in signIn callback:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        await connectDB();
        let dbUser;

        if (account?.provider === 'google' || account?.provider === 'github') {
          const email = user.email?.toLowerCase();
          if (email) {
            dbUser = await User.findOne({ email });
            if (!dbUser) {
              dbUser = await User.create({
                name: user.name || email.split('@')[0] || 'User',
                email,
                image: user.image || '',
                provider: account.provider,
                settings: {},
              });
            }
            token.uid = dbUser._id.toString();
          } else {
            token.uid = user.id;
          }
        } else {
          token.uid = user.id;
          if (mongoose.Types.ObjectId.isValid(user.id)) {
            dbUser = await User.findById(user.id);
          }
        }

        if (user.email) {
          token.email = user.email.toLowerCase();
        }
      }
      
      // If client updates session (e.g. settings change)
      if (trigger === 'update' && session?.settings) {
        token.settings = session.settings;
      } else if (user) {
        // Load initial settings
        try {
          let dbUser = null;
          if (mongoose.Types.ObjectId.isValid(token.uid)) {
            dbUser = await User.findById(token.uid);
          }
          if (!dbUser && token.email) {
            dbUser = await User.findOne({ email: token.email.toLowerCase() });
          }
          if (dbUser) {
            token.settings = {
              theme: dbUser.settings.theme,
              selectedModel: dbUser.settings.selectedModel,
              systemPrompt: dbUser.settings.systemPrompt,
              customApiKey: dbUser.settings.customApiKey ? 'configured' : '',
            };
          }
        } catch (e) {
          console.error('Error loading user settings in JWT callback:', e);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid;
        session.user.settings = token.settings || {
          theme: 'dark',
          selectedModel: 'openrouter/auto',
          systemPrompt: 'You are OddAI, a helpful, harmless, and honest AI assistant. You provide clear, accurate, and thoughtful responses.',
          customApiKey: '',
        };
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function resolveSessionUserId(session) {
  if (!session?.user) {
    return null;
  }

  const { id, email } = session.user;
  if (id && mongoose.Types.ObjectId.isValid(id)) {
    return id;
  }

  if (!email) {
    return null;
  }

  await connectDB();
  const user = await User.findOne({ email: email.toLowerCase() }).select('_id');
  return user?._id?.toString() || null;
}
