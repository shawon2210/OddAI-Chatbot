'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Square, Sparkles, AlertCircle, Loader } from 'lucide-react';
import ModelSelector from './ModelSelector';
import WelcomeScreen from './WelcomeScreen';
import Message from './Message';
import styles from './ChatArea.module.css';

export default function ChatArea({
  messages,
  activeConversation,
  onSendMessage,
  isStreaming,
  onStopGeneration,
  isLoadingMessages,
  selectedModel,
  onModelChange,
}) {
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-resize textarea when text is typed
  const handleInputChange = (e) => {
    setInputText(e.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  // Scroll to bottom on message updates or streaming content
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  // Adjust textarea back to normal height after message is sent
  useEffect(() => {
    if (inputText === '' && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [inputText]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isStreaming) return;

    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleKeyDown = (e) => {
    // Submit on Enter, allow shift+Enter for newlines
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSelectPrompt = (promptText) => {
    onSendMessage(promptText);
  };

  return (
    <div className={styles.container}>
      {/* Top Header Bar */}
      <header className={styles.header}>
        <div className={styles.headerTitleArea}>
          <h2 className={styles.headerTitle}>
            {activeConversation ? activeConversation.title : 'New Session'}
          </h2>
          {isStreaming && (
            <span className={styles.streamingStatus}>
              <span className={styles.pulseDot} />
              Generating response...
            </span>
          )}
        </div>

        <div className={styles.headerActions}>
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={onModelChange}
            disabled={isStreaming}
          />
        </div>
      </header>

      {/* Message Area */}
      <div className={styles.messageViewport}>
        {isLoadingMessages ? (
          <div className={styles.loadingMessages}>
            <Loader className={styles.spinner} size={28} />
            <p>Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <WelcomeScreen onSelectPrompt={handleSelectPrompt} />
        ) : (
          <div className={styles.messageList}>
            {messages.map((message) => (
              <Message key={message.id || message._id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Prompt Section */}
      <div className={styles.inputArea}>
        <form onSubmit={handleSubmit} className={styles.inputForm}>
          <div className={styles.textareaWrapper}>
            <textarea
              ref={textareaRef}
              className={styles.textarea}
              placeholder={
                isStreaming
                  ? 'Please wait for response to complete...'
                  : 'Ask OddAI anything... (Press Enter to send, Shift + Enter for new line)'
              }
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isStreaming || isLoadingMessages}
              rows={1}
            />

            {/* Action Buttons: Send / Stop */}
            <div className={styles.actions}>
              {isStreaming ? (
                <button
                  type="button"
                  onClick={onStopGeneration}
                  className={`${styles.actionButton} ${styles.stopButton}`}
                  title="Stop generating response"
                >
                  <Square size={16} fill="currentColor" />
                  <span className={styles.btnLabel}>Stop</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!inputText.trim() || isLoadingMessages}
                  className={`${styles.actionButton} ${styles.sendButton}`}
                  title="Send prompt to AI"
                >
                  <Send size={16} />
                  <span className={styles.btnLabel}>Send</span>
                </button>
              )}
            </div>
          </div>
          <div className={styles.inputFooter}>
            <Sparkles size={12} className={styles.sparkleIcon} />
            <span>OddAI can make mistakes. Verify critical industrial surveillance telemetry.</span>
          </div>
        </form>
      </div>
    </div>
  );
}
