'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Square, Loader, Paperclip, Globe, Zap, X } from 'lucide-react';
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
  const [inputText, setInputText]     = useState('');
  const [webSearch, setWebSearch]     = useState(false);
  const [reasoning, setReasoning]     = useState(false);
  const [attachments, setAttachments] = useState([]);
  const textareaRef                   = useRef(null);
  const messagesEndRef                = useRef(null);
  const viewportRef                   = useRef(null);
  const fileInputRef                  = useRef(null);

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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () =>
            resolve({ name: file.name, type: file.type, size: file.size, dataUrl: reader.result });
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then((results) =>
      setAttachments((prev) => [...prev, ...results])
    );
    e.target.value = '';
  };

  const removeAttachment = (index) =>
    setAttachments((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = () => {
    if ((!inputText.trim() && attachments.length === 0) || isStreaming) return;
    onSendMessage(inputText.trim(), { webSearch, reasoning, attachments });
    setInputText('');
    setAttachments([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const hasContent = inputText.trim().length > 0 || attachments.length > 0;

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
          <WelcomeScreen onSelectPrompt={(p) => onSendMessage(p, { webSearch, reasoning, attachments: [] })} />
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

          {/* Attachment previews */}
          {attachments.length > 0 && (
            <div className={styles.attachmentList}>
              {attachments.map((f, i) => (
                <div key={i} className={styles.attachmentChip}>
                  <Paperclip size={12} />
                  <span className={styles.attachmentName}>{f.name}</span>
                  <button
                    type="button"
                    className={styles.attachmentRemove}
                    onClick={() => removeAttachment(i)}
                    title="Remove"
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}

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
                className={`${styles.sendBtn} ${hasContent ? styles.sendReady : ''}`}
                onClick={handleSubmit}
                disabled={!hasContent || isLoadingMessages}
                title="Send message"
              >
                <ArrowUp size={16} />
              </button>
            )}
          </div>

          {/* Bottom toolbar row */}
          <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".txt,.md,.pdf,.csv,.json,.js,.ts,.py,.html,.css,.xml,.yaml,.yml,image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <button
                type="button"
                className={styles.toolBtn}
                title="Attach file"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip size={15} />
                <span>Attach</span>
              </button>
              <button
                type="button"
                className={`${styles.toolBtn} ${webSearch ? styles.toolBtnActive : ''}`}
                title="Search the web for up-to-date info"
                onClick={() => setWebSearch((v) => !v)}
              >
                <Globe size={15} />
                <span>Search</span>
              </button>
              <button
                type="button"
                className={`${styles.toolBtn} ${reasoning ? styles.toolBtnActive : ''}`}
                title="Enable extended reasoning"
                onClick={() => setReasoning((v) => !v)}
              >
                <Zap size={15} />
                <span>Reason</span>
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
