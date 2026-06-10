'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Square, Sparkles, Loader, Paperclip, Globe, Zap } from 'lucide-react';
import WelcomeScreen from './WelcomeScreen';
import Message from './Message';
import styles from './ChatArea.module.css';

export default function ChatArea({
  messages,
  onSendMessage,
  isStreaming,
  onStopGeneration,
  isLoadingMessages,
}) {
  const [inputText, setInputText]   = useState('');
  const textareaRef                 = useRef(null);
  const messagesEndRef              = useRef(null);
  const viewportRef                 = useRef(null);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    autoResize();
  };

  useEffect(() => {
    if (inputText === '' && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [inputText]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const handleSubmit = () => {
    if (!inputText.trim() || isStreaming) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const hasText = inputText.trim().length > 0;

  return (
    <div className={styles.container}>
      {/* Message viewport */}
      <div className={styles.viewport} ref={viewportRef}>
        {isLoadingMessages ? (
          <div className={styles.loadingWrap}>
            <Loader size={20} className={styles.spin} />
            <span>Loading messages…</span>
          </div>
        ) : messages.length === 0 ? (
          <WelcomeScreen onSelectPrompt={(p) => onSendMessage(p)} />
        ) : (
          <div className={styles.messagesInner}>
            {messages.map((msg) => (
              <Message key={msg.id || msg._id} message={msg} />
            ))}
            <div ref={messagesEndRef} style={{ height: 1 }} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className={styles.inputArea}>
        <div className={styles.inputWrap}>
          {/* Main input box */}
          <div className={styles.inputBox}>
            <textarea
              ref={textareaRef}
              className={styles.textarea}
              placeholder="Message OddAI"
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isStreaming || isLoadingMessages}
              rows={1}
            />

            {/* Send / Stop */}
            {isStreaming ? (
              <button
                type="button"
                className={`${styles.sendBtn} ${styles.stopBtn}`}
                onClick={onStopGeneration}
                title="Stop generating"
              >
                <Square size={14} fill="currentColor" />
              </button>
            ) : (
              <button
                type="button"
                className={`${styles.sendBtn} ${hasText ? styles.sendReady : ''}`}
                onClick={handleSubmit}
                disabled={!hasText || isLoadingMessages}
                title="Send message"
              >
                <ArrowUp size={16} />
              </button>
            )}
          </div>

          {/* Bottom toolbar row */}
          <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
              <button type="button" className={styles.toolBtn} title="Attach file">
                <Paperclip size={16} />
              </button>
              <button type="button" className={styles.toolBtn} title="Search web">
                <Globe size={16} />
              </button>
              <button type="button" className={styles.toolBtn} title="Reason">
                <Zap size={16} />
              </button>
            </div>
          </div>

          <p className={styles.disclaimer}>
            OddAI can make mistakes. Verify critical information.
          </p>
        </div>
      </div>
    </div>
  );
}
