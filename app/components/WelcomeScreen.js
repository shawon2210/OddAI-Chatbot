'use client';

import React from 'react';
import { ShieldAlert, Cpu, Eye, FileText } from 'lucide-react';
import styles from './WelcomeScreen.module.css';

const SUGGESTED_PROMPTS = [
  {
    title: 'PPE Compliance',
    description: 'Explain how computer vision detects PPE compliance.',
    prompt: 'Explain how computer vision is used to detect PPE (Personal Protective Equipment) compliance on industrial shop floors.',
    icon: <Eye size={20} className={styles.cardIcon} />,
  },
  {
    title: 'Incident Reporting',
    description: 'Draft a security incident report template.',
    prompt: 'Draft a professional security incident report template tailored for a chemical manufacturing plant.',
    icon: <FileText size={20} className={styles.cardIcon} />,
  },
  {
    title: 'Thermal Anomalies',
    description: 'Identify anomalies in machinery using AI.',
    prompt: 'How can deep learning and infrared thermography identify anomalies in critical manufacturing equipment before failure?',
    icon: <Cpu size={20} className={styles.cardIcon} />,
  },
  {
    title: 'Intrusion Protocol',
    description: 'Analyze warehouse intrusion response guidelines.',
    prompt: 'Analyze standard operating protocols for responding to unauthorized intrusion in a high-security warehouse environment.',
    icon: <ShieldAlert size={20} className={styles.cardIcon} />,
  },
];

export default function WelcomeScreen({ onSelectPrompt }) {
  return (
    <div className={`${styles.container} slide-up`}>
      <div className={styles.heroSection}>
        {/* Animated Brand Logo */}
        <div className={styles.logoContainer}>
          <svg
            className={styles.logoSvg}
            width="80"
            height="80"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="url(#accentGradient)"
              strokeWidth="4"
              strokeDasharray="10 5"
              className={styles.outerRing}
            />
            <circle
              cx="50"
              cy="50"
              r="28"
              stroke="var(--text-secondary)"
              strokeWidth="1.5"
              strokeOpacity="0.3"
            />
            <path
              d="M50 35 L62 48 L58 65 L42 65 L38 48 Z"
              fill="url(#accentGradient)"
              className={styles.innerShield}
            />
            <circle cx="50" cy="50" r="6" fill="var(--bg-primary)" className={styles.innerCore} />
            <defs>
              <linearGradient id="accentGradient" x1="0" y1="0" x2="100" y2="100">
                <stop offset="0%" stopColor="var(--accent-primary)" />
                <stop offset="100%" stopColor="var(--accent-secondary)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h1 className={styles.title}>
          OddAI <span className={styles.gradientText}>Assistant</span>
        </h1>
        <p className={styles.subtitle}>
          Industrial Surveillance & Threat Intelligence Co-Pilot. Powered by next-gen reasoning models.
        </p>
      </div>

      <div className={styles.promptsGrid}>
        {SUGGESTED_PROMPTS.map((item, index) => (
          <button
            key={index}
            type="button"
            className={styles.promptCard}
            onClick={() => onSelectPrompt(item.prompt)}
          >
            <div className={styles.cardHeader}>
              <div className={styles.iconBox}>{item.icon}</div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
            </div>
            <p className={styles.cardDesc}>{item.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
