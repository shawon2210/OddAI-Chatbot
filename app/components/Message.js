'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, AlertTriangle, RefreshCcw, ThumbsUp, ThumbsDown, Paperclip } from 'lucide-react';
import styles from './Message.module.css';

function CodeBlock({ language, value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.codeBlock}>
      <div className={styles.codeHeader}>
        <span className={styles.codeLang}>{language || 'code'}</span>
        <button type="button" className={styles.copyCodeBtn} onClick={handleCopy}>
          {copied
            ? <><Check size={13} style={{ color: 'var(--success)' }} /> Copied</>
            : <><Copy size={13} /> Copy code</>}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || 'text'}
        style={oneDark}
        customStyle={{
          margin: 0,
          background: '#1a1a1a',
          padding: '14px 16px',
          fontSize: '13px',
          lineHeight: '1.6',
          borderRadius: '0 0 8px 8px',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}

export default function Message({ message, index = 0, isNew = false }) {
  const { role, content, timestamp, isStreaming, isError, attachments } = message;
  const isUser = role === 'user';
  const [copied, setCopied] = useState(false);

  // Support both plain string and multimodal content array
  const displayContent =
    typeof content === 'string'
      ? content
      : Array.isArray(content)
        ? content.find((c) => c.type === 'text')?.text || ''
        : '';

  const handleCopy = () => {
    if (!displayContent) return;
    navigator.clipboard.writeText(displayContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const isTyping = !isUser && isStreaming && !displayContent;

  // Stagger animation delay based on message index
  const animDelay = `${index * 50}ms`;

  return (
    <div
      className={`${styles.row} ${isUser ? styles.userRow : styles.aiRow} ${isNew ? styles.msgNew : ''}`}
      style={{ animationDelay: animDelay }}
    >
      {isUser ? (
        /* ── User bubble ── */
        <div className={styles.userBubble}>
          {attachments?.length > 0 && (
            <div className={styles.attachmentBadges}>
              {attachments.map((f, i) => (
                <span key={i} className={styles.attachmentBadge}>
                  <Paperclip size={11} />
                  {f.name}
                </span>
              ))}
            </div>
          )}
          {displayContent}
        </div>
      ) : (
        /* ── AI response ── */
        <div className={styles.aiWrap}>
          {/* Avatar */}
          <div className={styles.aiAvatar}>
            <svg width="16" height="16" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835 9.964 9.964 0 0 0-6.211-3.464 10.079 10.079 0 0 0-10.436 4.963 9.962 9.962 0 0 0-6.675 4.715 10.08 10.08 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 6.211 3.464 10.079 10.079 0 0 0 10.436-4.963 9.962 9.962 0 0 0 6.675-4.715 10.079 10.079 0 0 0-1.24-11.817zm-17.151 23.956a7.463 7.463 0 0 1-4.798-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.49 7.437zM4.944 33.901a7.464 7.464 0 0 1-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103L15.054 36.92a7.504 7.504 0 0 1-10.11-3.019zm-2.8-17.185a7.462 7.462 0 0 1 3.908-3.285c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.012L4.89 27.374a7.504 7.504 0 0 1-2.746-10.659zm27.658 6.437l-9.724-5.615 3.367-1.943a.121.121 0 0 1 .114-.012l8.048 4.648a7.498 7.498 0 0 1-1.158 13.528v-9.476a1.293 1.293 0 0 0-.647-1.13zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.183-4.726a7.506 7.506 0 0 1 10.999 7.844zm-21.063 6.929l-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.505 7.505 0 0 1 12.293-5.756 6.94 6.94 0 0 0-.236.134l-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.006 11.225zm1.829-3.943l4.33-2.501 4.332 2.5v4.999l-4.331 2.5-4.331-2.5V21.096z" fill="currentColor"/>
            </svg>
          </div>

          <div className={styles.aiContent}>
            {isError ? (
              <div className={styles.errorBox}>
                <AlertTriangle size={15} />
                <span>{displayContent}</span>
              </div>
            ) : isTyping ? (
              <div className={styles.typingIndicator}>
                <div className={styles.typingDots}>
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </div>
                <span className={styles.typingText}>OddAI is thinking</span>
              </div>
            ) : isStreaming ? (
              <div className={styles.prose}>
                <span style={{ whiteSpace: 'pre-wrap' }}>{displayContent}</span>
                <span className={styles.cursor} />
              </div>
            ) : (
              <div className={styles.prose}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ className, children }) {
                      const match = /language-(\w+)/.exec(className || '');
                      const val = String(children).replace(/\n$/, '');
                      return match
                        ? <CodeBlock language={match[1]} value={val} />
                        : <code className={styles.inlineCode}>{children}</code>;
                    },
                    table({ children }) {
                      return (
                        <div className={styles.tableWrap}>
                          <table className={styles.table}>{children}</table>
                        </div>
                      );
                    },
                    a({ href, children }) {
                      return <a href={href} target="_blank" rel="noopener noreferrer" className={styles.link}>{children}</a>;
                    },
                  }}
                >
                  {displayContent}
                </ReactMarkdown>
              </div>
            )}

            {/* Action bar */}
            {!isStreaming && !isTyping && displayContent && (
              <div className={styles.actions}>
                <button type="button" className={styles.actionBtn} onClick={handleCopy} title="Copy">
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                </button>
                <button type="button" className={styles.actionBtn} title="Good response">
                  <ThumbsUp size={15} />
                </button>
                <button type="button" className={styles.actionBtn} title="Bad response">
                  <ThumbsDown size={15} />
                </button>
                <button type="button" className={styles.actionBtn} title="Regenerate">
                  <RefreshCcw size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
