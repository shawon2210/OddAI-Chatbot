'use client';

import React from 'react';
import styles from './WelcomeScreen.module.css';

const SUGGESTIONS = [
  { label: 'Explain PPE compliance detection using computer vision' },
  { label: 'Draft a security incident report for a manufacturing plant' },
  { label: 'How does AI detect thermal anomalies in machinery?' },
  { label: 'Summarize intrusion response protocols for warehouses' },
  { label: 'Compare CCTV analytics vs traditional security monitoring' },
  { label: 'Write a Python script to parse surveillance event logs' },
];

export default function WelcomeScreen({ onSelectPrompt }) {
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.logoMark}>O</div>
        <h1 className={styles.heading}>What can I help with?</h1>

        <div className={styles.suggestions}>
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              type="button"
              className={styles.chip}
              onClick={() => onSelectPrompt(s.label)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
