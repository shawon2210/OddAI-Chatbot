import { Inter, JetBrains_Mono } from 'next/font/google';
import ClientProviders from './components/ClientProviders';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'OddAI Chatbot — Advanced Surveillance & Threat Intelligence Assistant',
  description: 'A premium, production-ready AI chatbot assistant powered by OpenRouter free-tier models. Developed by Shawon.',
  authors: [{ name: 'Shawon', url: 'https://github.com/shawon2210' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0 }} suppressHydrationWarning>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}

