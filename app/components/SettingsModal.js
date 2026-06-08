'use client';

import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Save, Settings, ShieldAlert, Sparkles } from 'lucide-react';
import styles from './SettingsModal.module.css';

export default function SettingsModal({ settings, onSave, onClose }) {
  const [theme, setTheme] = useState(settings.theme || 'dark');
  const [systemPrompt, setSystemPrompt] = useState(settings.systemPrompt || '');
  const [customApiKey, setCustomApiKey] = useState(settings.customApiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);

  // Sync state if settings prop updates
  useEffect(() => {
    if (settings) {
      setTheme(settings.theme || 'dark');
      setSystemPrompt(settings.systemPrompt || '');
      setCustomApiKey(settings.customApiKey || '');
    }
  }, [settings]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      theme,
      systemPrompt,
      customApiKey,
    });
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`${styles.modalContent} fade-in`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.titleGroup}>
            <Settings className={styles.headerIcon} size={20} />
            <h2>Settings</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close settings">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalBody}>
          {/* Theme setting */}
          <div className={styles.section}>
            <label className={styles.sectionLabel}>Theme Mode</label>
            <div className={styles.themeToggleContainer}>
              <button
                type="button"
                className={`${styles.themeOption} ${theme === 'dark' ? styles.activeOption : ''}`}
                onClick={() => setTheme('dark')}
              >
                Dark Theme
              </button>
              <button
                type="button"
                className={`${styles.themeOption} ${theme === 'light' ? styles.activeOption : ''}`}
                onClick={() => setTheme('light')}
              >
                Light Theme
              </button>
            </div>
          </div>

          {/* System Prompt setting */}
          <div className={styles.section}>
            <label className={styles.sectionLabel} htmlFor="systemPrompt">
              System Instruction Prompt
            </label>
            <p className={styles.sectionDesc}>
              Guides the assistant's behavior, tone, and system instructions for all new conversations.
            </p>
            <textarea
              id="systemPrompt"
              className={styles.textarea}
              placeholder="e.g. You are a senior industrial surveillance and physical threat analyst..."
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={4}
            />
          </div>

          {/* API Key setting */}
          <div className={styles.section}>
            <div className={styles.apiKeyLabelRow}>
              <label className={styles.sectionLabel} htmlFor="apiKey">
                OpenRouter API Key (Optional)
              </label>
              <span className={styles.badge}>Custom Key</span>
            </div>
            <p className={styles.sectionDesc}>
              Provide your own OpenRouter key to bypass default rate-limits. Your key is encrypted and stored securely.
            </p>
            <div className={styles.inputWrapper}>
              <input
                id="apiKey"
                type={showApiKey ? 'text' : 'password'}
                className={styles.input}
                placeholder="sk-or-v1-..."
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
              />
              <button
                type="button"
                className={styles.toggleVisibilityBtn}
                onClick={() => setShowApiKey(!showApiKey)}
                aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
              >
                {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Alert Info box */}
          <div className={styles.infoBox}>
            <ShieldAlert size={16} className={styles.infoIcon} />
            <p>
              Settings are synchronized across your authenticated devices. Free-tier models will load instantly.
            </p>
          </div>

          {/* Footer Actions */}
          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn}>
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
