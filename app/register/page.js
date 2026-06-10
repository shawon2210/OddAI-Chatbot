'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { User, Mail, Lock, ChevronRight, CheckCircle2 } from 'lucide-react';
import styles from './register.module.css';

export default function Register() {
  const { status } = useSession();
  const router = useRouter();
  const videoRef = useRef(null);
  const rafRef   = useRef(null);

  const [name, setName]                       = useState('');
  const [email, setEmail]                     = useState('');
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError]                     = useState('');
  const [success, setSuccess]                 = useState('');
  const [isLoading, setIsLoading]             = useState(false);

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
    setSuccess('');
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || 'Registration failed');
      else {
        setSuccess('Account created! Redirecting to sign in…');
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const disabled = isLoading || !!success;

  return (
    <div className={styles.page}>
      <video
        ref={videoRef}
        className={styles.videoBg}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4"
        muted playsInline preload="auto"
      />
      <div className={styles.blurBg} aria-hidden="true" />

      <Link href="/landing" className={styles.backLink}>
        <span>←</span> OddAI
      </Link>

      <div className={styles.card}>
        <div className={styles.logoRow}>
          <div className={styles.logoMark}>O</div>
          <span className={styles.logoText}>OddAI</span>
        </div>

        <h1 className={styles.heading}>Create an account</h1>
        <p className={styles.sub}>Start your AI journey today — it&apos;s free</p>

        {error   && <div className={styles.errorBanner}>{error}</div>}
        {success && (
          <div className={styles.successBanner}>
            <CheckCircle2 size={15} /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="name">Full Name</label>
            <div className={styles.inputWrap}>
              <User size={15} className={styles.inputIcon} />
              <input id="name" type="text" placeholder="Jane Smith"
                value={name} onChange={(e) => setName(e.target.value)}
                required disabled={disabled} className={styles.input} />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <div className={styles.inputWrap}>
              <Mail size={15} className={styles.inputIcon} />
              <input id="email" type="email" placeholder="you@domain.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                required disabled={disabled} className={styles.input} />
            </div>
          </div>

          <div className={styles.twoCol}>
            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <div className={styles.inputWrap}>
                <Lock size={15} className={styles.inputIcon} />
                <input id="password" type="password" placeholder="Min. 6 chars"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  required disabled={disabled} className={styles.input} />
              </div>
            </div>
            <div className={styles.field}>
              <label htmlFor="confirmPassword">Confirm</label>
              <div className={styles.inputWrap}>
                <Lock size={15} className={styles.inputIcon} />
                <input id="confirmPassword" type="password" placeholder="Repeat"
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  required disabled={disabled} className={styles.input} />
              </div>
            </div>
          </div>

          <button type="submit" disabled={disabled} className={styles.submitBtn}>
            {isLoading ? 'Creating account…' : <><span>Create Account</span><ChevronRight size={16} /></>}
          </button>
        </form>

        <p className={styles.footerText}>
          Already have an account?{' '}
          <Link href="/login" className={styles.footerLink}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
