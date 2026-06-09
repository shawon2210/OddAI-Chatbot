'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ShieldAlert, Sparkles, LogIn } from 'lucide-react';
import styles from './login.module.css';

function LoginContent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(() => {
    const errorParam = searchParams.get('error');
    if (!errorParam) {
      return '';
    }
    if (errorParam === 'OAuthSignin' || errorParam === 'OAuthCallback') {
      return 'Error connecting with the auth provider.';
    }
    if (errorParam === 'OAuthCreateAccount') {
      return 'Failed to create account from auth provider.';
    }
    if (errorParam === 'Callback') {
      return 'Authorization callback failed.';
    }
    return 'An authentication error occurred.';
  });
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = (provider) => {
    signIn(provider, { callbackUrl: '/' });
  };

  if (status === 'loading') {
    return (
      <div className={styles.card} style={{ minHeight: '300px', justifyContent: 'center' }}>
        <Sparkles className={styles.logoIcon} style={{ fontSize: '3rem', marginBottom: '20px' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Verifying session...</p>
      </div>
    );
  }

  return (
    <div className={styles.card + ' slide-up'}>
      <div className={styles.logoContainer}>
        <Sparkles className={styles.logoIcon} />
        <span className={styles.title}>OddAI</span>
      </div>
      <p className={styles.subtitle}>Threat Intelligence & Surveillance Assistant</p>

      {error && (
        <div className={styles.errorAlert}>
          <ShieldAlert size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email Address</label>
          <div className={styles.inputWrapper}>
            <Mail className={styles.inputIcon} size={18} />
            <input
              id="email"
              type="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <div className={styles.inputWrapper}>
            <Lock className={styles.inputIcon} size={18} />
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
              disabled={isLoading}
            />
          </div>
        </div>

        <button type="submit" disabled={isLoading} className={styles.submitBtn}>
          {isLoading ? (
            'Signing in...'
          ) : (
            <>
              <LogIn size={18} /> Sign In
            </>
          )}
        </button>
      </form>

      <div className={styles.divider}>
        <span>or continue with</span>
      </div>

      <div className={styles.oauthGrid}>
        <button
          onClick={() => handleOAuthLogin('google')}
          disabled={isLoading}
          className={styles.oauthBtn}
        >
          Google
        </button>
        <button
          onClick={() => handleOAuthLogin('github')}
          disabled={isLoading}
          className={styles.oauthBtn}
        >
          GitHub
        </button>
      </div>

      <div className={styles.footer}>
        Don&apos;t have an account?{' '}
        <Link href="/register" className={styles.link}>
          Sign up
        </Link>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <div className={styles.container + ' fade-in'}>
      <Suspense fallback={
        <div className={styles.card} style={{ minHeight: '300px', justifyContent: 'center' }}>
          <Sparkles className={styles.logoIcon} style={{ fontSize: '3rem', marginBottom: '20px' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading session...</p>
        </div>
      }>
        <LoginContent />
      </Suspense>
    </div>
  );
}
