'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight, Sparkles } from 'lucide-react';
import './landing.css';
import styles from './landing.module.css';

const LOGOS = ['Vortex', 'Nimbus', 'Prysma', 'Cirrus', 'Kynder', 'Halcyn'];
const LOGO_COLORS = ['#6366f1', '#a855f7', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'];

export default function LandingPage() {
  const videoRef = useRef(null);
  const rafRef   = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let alive = true;
    const FADE = 0.5;

    function loop() {
      if (!alive) return;
      const dur = video.duration || 0;
      if (dur) {
        const t = video.currentTime;
        let o = 1;
        if (t < FADE) o = t / FADE;
        else if (t > dur - FADE) o = (dur - t) / FADE;
        video.style.opacity = String(o);
      }
      rafRef.current = requestAnimationFrame(loop);
    }

    function onEnded() {
      if (!alive) return;
      video.style.opacity = '0';
      cancelAnimationFrame(rafRef.current);
      setTimeout(() => {
        if (!alive) return;
        video.currentTime = 0;
        video.play().then(() => {
          if (alive) rafRef.current = requestAnimationFrame(loop);
        }).catch(() => {});
      }, 100);
    }

    video.play().then(() => {
      if (alive) rafRef.current = requestAnimationFrame(loop);
    }).catch(() => {});

    video.addEventListener('ended', onEnded);
    return () => {
      alive = false;
      video.removeEventListener('ended', onEnded);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const doubled = [...LOGOS, ...LOGOS];

  return (
    <section className={styles.hero}>
      <video
        ref={videoRef}
        className={styles.videoBg}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4"
        muted playsInline preload="auto"
      />
      <div className={styles.blurOverlay} aria-hidden="true" />

      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navLogo}>
          <div className={styles.navLogoMark}>O</div>
          <span>OddAI</span>
        </div>
        <div className={styles.navCenter}>
          {[['Features', true], ['Solutions', false], ['Plans', false], ['Learning', true]].map(([label, chevron]) => (
            <button key={label} className={styles.navBtn} type="button">
              {label}{chevron && <ChevronDown size={14} />}
            </button>
          ))}
        </div>
        <Link href="/register" className={styles.signUpBtn}>Sign Up</Link>
      </nav>
      <div className={styles.navDivider} />

      {/* Hero content — centered */}
      <div className={styles.heroContent}>
        <div className={styles.heroInner}>

          {/* Badge */}
          <div className={styles.badge}>
            <Sparkles size={13} />
            <span>Powered by OpenRouter · Free tier models</span>
          </div>

          {/* Headline */}
          <h1 className={styles.headline}>
            Your AI assistant,<br />
            <span className={styles.headlineGradient}>always ready.</span>
          </h1>

          {/* Subtitle */}
          <p className={styles.subtitle}>
            OddAI is a premium conversational AI chatbot built for speed,
            clarity, and intelligence. Stream answers in real time, manage
            conversations, and switch between the world&apos;s best free models.
          </p>

          {/* CTAs */}
          <div className={styles.ctaRow}>
            <Link href="/register" className={styles.ctaPrimary}>
              Get started free <ArrowRight size={16} />
            </Link>
            <Link href="/login" className={styles.ctaSecondary}>
              Sign in
            </Link>
          </div>

          {/* Stats row */}
          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statNum}>6+</span>
              <span className={styles.statLabel}>Free AI models</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>∞</span>
              <span className={styles.statLabel}>Conversations</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>Real‑time</span>
              <span className={styles.statLabel}>Streaming responses</span>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className={styles.marqueeSection}>
        <div className={styles.marqueeInner}>
          <p className={styles.marqueeLabel}>{'Relied on by brands\nacross the globe'}</p>
          <div className={styles.marqueeTrack}>
            <div className={styles.marqueeList}>
              {doubled.map((name, i) => (
                <div key={i} className={styles.logoItem}>
                  <div
                    className={`${styles.logoIcon} liquid-glass`}
                    style={{ background: LOGO_COLORS[i % LOGOS.length] + '33' }}
                  >
                    {name[0]}
                  </div>
                  <span className={styles.logoName}>{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
