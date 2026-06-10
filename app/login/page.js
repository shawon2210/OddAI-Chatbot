'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ChevronRight } from 'lucide-react';
import styles from './login.module.css';

function LoginContent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const videoRef = useRef(null);
  const rafRef   = useRef(null);

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(() => {
    const p = searchParams.get('error');
    if (!p) return '';
    if (p === 'OAuthSignin' || p === 'OAuthCallback') return 'Error connecting with the auth provider.';
    if (p === 'OAuthCreateAccount') return 'Failed to create account from auth provider.';
    if (p === 'Callback') return 'Authorization callback failed.';
    return 'An authentication error occurred.';
  });

  useEffect(() => {
    if (status === 'authenticated') router.push('/');
  }, [status, router]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const FADE = 0.5;
    function loop() {
      const dur = video.duration || 0;
      if (dur) {
        const t = video.currentTime;
        let o = 1;
        if (t < FADE) o = t / FADE;
        else if (t > dur - FADE) o = (dur - t) / FADE;
        video.style.opacity = o;
      }
      rafRef.current = requestAnimationFrame(loop);
    }
    function onEnded() {
      video.style.opacity = 0;
      cancelAnimationFrame(rafRef.current);
      setTimeout(() => {
        video.currentTime = 0;
        video.play().then(() => { rafRef.current = requestAnimationFrame(loop); }).catch(() => {});
      }, 100);
    }
    video.play().then(() => { rafRef.current = requestAnimationFrame(loop); }).catch(() => {});
    video.addEventListener('ended', onEnded);
    return () => { video.removeEventListener('ended', onEnded); cancelAnimationFrame(rafRef.current); };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const result = await signIn('credentials', { email, password, redirect: false });
      if (result?.error) setError(result.error);
      else router.push('/');
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <video
        ref={videoRef}
        className={styles.videoBg}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4"
        muted playsInline preload="auto"
      />
      <div className={styles.blurBg} aria-hidden="true" />

      {/* Back to landing */}
      <Link href="/landing" className={styles.backLink}>
        <span>←</span> OddAI
      </Link>

      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoRow}>
          <div className={styles.logoMark}>O</div>
          <span className={styles.logoText}>OddAI</span>
        </div>

        <h1 className={styles.heading}>Welcome back</h1>
        <p className={styles.sub}>Sign in to your account to continue</p>

        {error && <div className={styles.errorBanner}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <div className={styles.inputWrap}>
              <Mail size={15} className={styles.inputIcon} />
              <input
                id="email" type="email" placeholder="you@domain.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                required disabled={isLoading} className={styles.input}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <div className={styles.inputWrap}>
              <Lock size={15} className={styles.inputIcon} />
              <input
                id="password" type="password" placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)}
                required disabled={isLoading} className={styles.input}
              />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className={styles.submitBtn}>
            {isLoading ? 'Signing in…' : <><span>Sign In</span><ChevronRight size={16} /></>}
          </button>
        </form>

        <div className={styles.divider}><span>or continue with</span></div>

        <div className={styles.oauthRow}>
          <button onClick={() => signIn('google', { callbackUrl: '/' })} disabled={isLoading} className={styles.oauthBtn} type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button onClick={() => signIn('github', { callbackUrl: '/' })} disabled={isLoading} className={styles.oauthBtn} type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            GitHub
          </button>
        </div>

        <p className={styles.footerText}>
          Don&apos;t have an account?{' '}
          <Link href="/register" className={styles.footerLink}>Sign up free</Link>
        </p>
      </div>

      {/* Developer credit */}
      <footer className={styles.devCredit}>
        © 2025 Shawon. All rights reserved. | Developed by <a href="https://github.com/shawon2210" target="_blank" rel="noopener noreferrer">shawon2210</a>
      </footer>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'hsl(260 87% 3%)' }} />}>
      <LoginContent />
    </Suspense>
  );
}
