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
        <div className={styles.logoContainer}>
          <svg
            className={styles.logoSvg}
            width="56"
            height="56"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="40" stroke="var(--accent)" strokeWidth="4" strokeDasharray="10 5" />
            <circle cx="50" cy="50" r="28" stroke="var(--text-tertiary)" strokeWidth="1.5" opacity="0.3" />
            <path d="M50 35 L62 48 L58 65 L42 65 L38 48 Z" fill="var(--accent)" />
            <circle cx="50" cy="50" r="6" fill="var(--bg-page)" />
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
            <div className={styles.iconBox}>{item.icon}</div>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <p className={styles.cardDesc}>{item.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
