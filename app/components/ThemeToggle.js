'use client';

import React from 'react';
import { useTheme } from './ClientProviders';
import { Sun, Moon } from 'lucide-react';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className={styles.toggleBtn}
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className={styles.iconWrapper}>
        <Sun className={`${styles.icon} ${styles.sun} ${theme === 'light' ? styles.active : ''}`} size={18} />
        <Moon className={`${styles.icon} ${styles.moon} ${theme === 'dark' ? styles.active : ''}`} size={18} />
      </div>
    </button>
  );
}
