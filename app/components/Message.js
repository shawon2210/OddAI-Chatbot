'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, User, Bot, AlertTriangle, RefreshCcw, ThumbsUp, ThumbsDown } from 'lucide-react';
import styles from './Message.module.css';

function CodeBlock({ language, value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.codeBlockContainer}>
      <div className={styles.codeBlockHeader}>
        <span className={styles.codeLang}>{language || 'code'}</span>
        <button onClick={handleCopy} className={styles.copyCodeBtn} type="button">
          {copied ? (
            <>
              <Check size={12} className={styles.copiedIcon} />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>
      <div className={styles.codeBlockBody}>
        <SyntaxHighlighter
          language={language || 'text'}
          style={oneDark}
          customStyle={{
            margin: 0,
            background: 'transparent',
            padding: '14px 16px',
            fontSize: '13px',
            lineHeight: '1.6',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default function Message({ message }) {
  const { role, content, timestamp, isStreaming, isError } = message;
  const isUser = role === 'user';
  const [copiedMessage, setCopiedMessage] = useState(false);

  const formatTime = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  const handleCopyMessage = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 1600);
  };

  const isTyping = !isUser && isStreaming;

  return (
    <div className={`${styles.messageRow} ${isUser ? styles.userRow : styles.aiRow}`}>
      {/* Avatar for AI */}
      {!isUser && (
        <div className={styles.aiAvatar}>✦</div>
      )}

      <div className={styles.aiContent}>
        {/* AI name label */}
        {!isUser && (
          <div className={styles.aiName}>OddAI</div>
        )}

        {/* Bubble */}
        <div
          className={`${styles.bubble} ${isError ? styles.errorBubble : ''}`}
        >
          {isError && <AlertTriangle size={16} className={styles.errorIcon} />}

          {isTyping && !content ? (
            <div className={styles.typingGroup}>
              <div className={styles.typingIndicator}>
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
              </div>
              <span className={styles.typingLabel}>Thinking…</span>
            </div>
          ) : (
            <div className={styles.markdownContent}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const codeVal = String(children).replace(/\n$/, '');
                    return match ? (
                      <CodeBlock language={match[1]} value={codeVal} />
                    ) : (
                      <code className={styles.inlineCode} {...props}>
                        {children}
                      </code>
                    );
                  },
                  table({ children }) {
                    return (
                      <div className={styles.tableWrapper}>
                        <table className={styles.table}>{children}</table>
                      </div>
                    );
                  },
                  a({ href, children }) {
                    return (
                      <a href={href} target="_blank" rel="noopener noreferrer" className={styles.link}>
                        {children}
                      </a>
                    );
                  },
                }}
              >
                {content}
              </ReactMarkdown>

              {!isUser && isStreaming && content && (
                <span className={styles.cursor} />
              )}
            </div>
          )}
        </div>

        {/* Action bar */}
        <div className={styles.actionBar}>
          <button type="button" className={styles.actionBtn} onClick={handleCopyMessage} title="Copy">
            <Copy size={13} />
            <span>{copiedMessage ? 'Copied' : 'Copy'}</span>
          </button>
          <button type="button" className={styles.actionBtn} title="Regenerate">
            <RefreshCcw size={13} />
          </button>
          <button type="button" className={styles.actionBtn} title="Good response">
            <ThumbsUp size={13} />
          </button>
          <button type="button" className={styles.actionBtn} title="Poor response">
            <ThumbsDown size={13} />
          </button>
        </div>

        {timestamp && (
          <span className={styles.timestamp}>{formatTime(timestamp)}</span>
        )}
      </div>

      {/* User avatar */}
      {isUser && (
        <div className={styles.userAvatar}>
          <User size={16} />
        </div>
      )}
    </div>
  );
}
