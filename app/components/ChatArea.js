'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Square, Sparkles, Loader, Paperclip } from 'lucide-react';
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
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    autoResize();
  };

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  };

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  useEffect(() => {
    if (inputText === '' && textareaRef.current) {
      textareaRef.current.style.height = '24px';
    }
  }, [inputText]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
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

  const handleSelectPrompt = (promptText) => {
    onSendMessage(promptText);
  };

  const hasText = inputText.trim().length > 0;

  return (
    <div className={styles.container}>
      {/* Message viewport */}
      <div className={styles.messageViewport}>
        {isLoadingMessages ? (
          <div className={styles.loadingMessages}>
            <Loader className={styles.spinner} size={24} />
            <p>Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <WelcomeScreen onSelectPrompt={handleSelectPrompt} />
        ) : (
          <div className={styles.messagesInner}>
            {messages.map((message) => (
              <Message key={message.id || message._id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className={styles.inputArea}>
        <div className={styles.inputAreaInner}>
          <div className={styles.inputBox} id="input-box">
            <div className={styles.inputToolbar}>
              <button
                type="button"
                className={styles.inputToolBtn}
                title="Attach file"
                onClick={() => {}}
              >
                <Paperclip size={16} />
              </button>
            </div>

            <textarea
              ref={textareaRef}
              className={styles.textarea}
              placeholder="Message OddAI..."
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isStreaming || isLoadingMessages}
              rows={1}
            />

            {isStreaming ? (
              <button
                type="button"
                onClick={onStopGeneration}
                className={`${styles.actionButton} ${styles.stopBtn}`}
                title="Stop generating"
              >
                <Square size={14} fill="currentColor" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!hasText || isLoadingMessages}
                className={`${styles.actionButton} ${styles.sendBtn} ${hasText ? styles.ready : ''}`}
                title="Send message"
              >
                <ArrowUp size={16} />
              </button>
            )}
          </div>

          <div className={styles.inputHint}>
            <Sparkles size={11} style={{ display: 'inline', marginRight: 4, color: 'var(--accent)' }} />
            OddAI can make mistakes. Verify critical information.
          </div>
        </div>
      </div>
    </div>
  );
}
