'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, User, Bot, AlertTriangle } from 'lucide-react';
import styles from './Message.module.css';

// Custom CodeBlock Component for Markdown rendering
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
        <span className={styles.codeLanguage}>{language || 'code'}</span>
        <button onClick={handleCopy} className={styles.copyBtn} title="Copy code">
          {copied ? (
            <>
              <Check size={13} className={styles.copiedIcon} />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Copy</span>
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
            padding: '14px',
            fontSize: '0.85rem',
            lineHeight: '1.45',
            fontFamily: 'var(--font-code)',
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

  const formatTime = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className={`${styles.messageWrapper} ${isUser ? styles.userWrapper : styles.aiWrapper}`}>
      {/* Avatar Icon */}
      <div className={`${styles.avatar} ${isUser ? styles.userAvatar : styles.aiAvatar}`}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      <div className={styles.messageContentArea}>
        {/* Message bubble itself */}
        <div
          className={`${styles.bubble} ${
            isUser ? styles.userBubble : styles.aiBubble
          } ${isError ? styles.errorBubble : ''}`}
        >
          {isError && <AlertTriangle size={16} className={styles.errorIcon} />}

          {/* If the message is assistant and completely empty, display typing indicator */}
          {!isUser && isStreaming && !content ? (
            <div className={styles.typingIndicator}>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
            </div>
          ) : (
            <div className={styles.markdownContent}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const codeVal = String(children).replace(/\n$/, '');
                    
                    // Render code block if class name starts with language-
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

              {/* Blinking cursor at the end of streaming text */}
              {!isUser && isStreaming && content && (
                <span className={styles.cursor} />
              )}
            </div>
          )}
        </div>

        {/* Timestamp */}
        {timestamp && (
          <span className={styles.timestamp}>{formatTime(timestamp)}</span>
        )}
      </div>
    </div>
  );
}
