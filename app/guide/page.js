'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, Code, Send, MessageSquare, Layers } from 'lucide-react';
import styles from './page.module.css';

const steps = [
  {
    title: 'Layout structure',
    desc: 'The whole shell is a 3-column layout with a fixed sidebar, a flexible chat column, and a sticky input bar at the bottom. The main area keeps messages centered with a 720px max width.',
    preview: () => (
      <div className={styles.layoutPreview}>
        <div className={styles.previewSidebar}>
          <div className={styles.previewLogo}>Claude</div>
          <button className={styles.previewNewChat}>+ New chat</button>
          <div className={styles.previewSectionLabel}>Today</div>
          <div className={styles.previewChatLink}>How does RAG work?</div>
          <div className={styles.previewChatLink}>Summarize the API docs</div>
        </div>
        <div className={styles.previewMainArea}>
          <div className={styles.previewTopBar}>
            <div className={styles.previewTitle}>Conversation</div>
            <div className={styles.previewIcons}>
              <span className={styles.previewIcon}>🔍</span>
              <span className={styles.previewIcon}>⚙️</span>
            </div>
          </div>
          <div className={styles.previewChatWindow}>
            <div className={styles.previewCallout}>Max message width: 720px, centered inside the main panel.</div>
          </div>
          <div className={styles.previewFooterHint}>Input stays fixed at bottom of the screen as the user scrolls.</div>
        </div>
      </div>
    ),
  },
  {
    title: 'Design tokens',
    desc: 'Define warm neutrals, purple accent, spacing, and radius as CSS variables before building components. This makes the interface consistent and easy to evolve.',
    preview: () => (
      <div className={styles.tokensPreview}>
        <div className={styles.tokenColumn}>
          <div className={styles.tokenSwatch} style={{ background: '#F9F8F6' }}>
            <span>Background primary</span>
            <strong>#F9F8F6</strong>
          </div>
          <div className={styles.tokenSwatch} style={{ background: '#F1EFE8' }}>
            <span>Sidebar background</span>
            <strong>#F1EFE8</strong>
          </div>
          <div className={styles.tokenSwatch} style={{ background: '#EEEDFE' }}>
            <span>Accent surface</span>
            <strong>#EEEDFE</strong>
          </div>
          <div className={styles.tokenSwatch} style={{ background: '#7F77DD', color: '#fff' }}>
            <span>Accent purple</span>
            <strong>#7F77DD</strong>
          </div>
        </div>
        <div className={styles.tokenDetails}>
          <div className={styles.tokenRow}><span>--space-sm</span><strong>8px</strong></div>
          <div className={styles.tokenRow}><span>--space-md</span><strong>16px</strong></div>
          <div className={styles.tokenRow}><span>--space-lg</span><strong>24px</strong></div>
          <div className={styles.tokenRow}><span>--radius-sm</span><strong>8px</strong></div>
          <div className={styles.tokenRow}><span>--radius-lg</span><strong>16px</strong></div>
          <div className={styles.tokenInfo}>Use tokens for borders, shadows, and spacing across every component.</div>
        </div>
      </div>
    ),
  },
  {
    title: 'Sidebar',
    desc: 'Keep the sidebar minimal: group conversations by Today / Yesterday / Last 7 days, include a prominent new chat button, and show the user profile at the bottom. On mobile it becomes a sliding drawer.',
    preview: () => (
      <div className={styles.sidebarPreviewExample}>
        <div className={styles.sidebarPreviewHeader}>
          <Sparkles size={16} />
          <span>MyAssistant</span>
        </div>
        <button className={styles.sidebarPreviewNew}>New chat</button>
        <div className={styles.sidebarPreviewGroup}>
          <div className={styles.sidebarPreviewSection}>Today</div>
          <div className={styles.sidebarPreviewItem}>Summarize the latest threat report</div>
          <div className={styles.sidebarPreviewItem}>Red team readiness</div>
        </div>
        <div className={styles.sidebarPreviewGroup}>
          <div className={styles.sidebarPreviewSection}>Yesterday</div>
          <div className={styles.sidebarPreviewItem}>Explain RAG architecture</div>
        </div>
        <div className={styles.sidebarPreviewProfile}>
          <div className={styles.profileAvatar}>SJ</div>
          <div>
            <div className={styles.profileName}>Security Jane</div>
            <div className={styles.profilePlan}>Free plan</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Message bubbles',
    desc: 'User messages are right-aligned with a purple bubble and white text. AI responses are left-aligned with a light background, avatar, and real markdown rendering for code, lists, and links.',
    preview: () => (
      <div className={styles.bubblesPreview}>
        <div className={styles.messageRow}>
          <div className={styles.userBubble}>
            Provide a quick checklist for secure model deployment.
          </div>
        </div>
        <div className={styles.messageRowAI}>
          <div className={styles.aiAvatar}>AI</div>
          <div className={styles.aiBubble}>
            Use real HTML markdown rendering:
            <ul>
              <li><code>helm install</code> and secrets management</li>
              <li>monitoring with Prometheus</li>
              <li>least privilege service accounts</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Input bar',
    desc: 'Use an auto-resizing textarea inside a pill-shaped container. The send button stays gray when empty and transitions to purple when there is content. Enter sends the message, Shift+Enter adds a newline.',
    preview: () => (
      <div className={styles.inputPreviewExample}>
        <div className={styles.inputLabel}>Type a message</div>
        <div className={styles.inputRow}>
          <textarea
            className={styles.previewTextarea}
            rows={1}
            value=""
            placeholder="Ask your assistant..."
            readOnly
          />
          <button className={styles.sendBtn}>Send</button>
        </div>
        <div className={styles.inputHint}>Shift + Enter for newline • Enter to submit</div>
      </div>
    ),
  },
  {
    title: 'Typography',
    desc: 'Use a clean type scale from 11px captions to 22px headings, with weights 400 and 500 only. Monospace is reserved for inline code and code blocks so the chat feels polished.',
    preview: () => (
      <div className={styles.typographyPreview}>
        <div>
          <div className={styles.textSizeLarge}>22px heading</div>
          <div className={styles.textSizeNormal}>16px body text example for chat replies and interface labels.</div>
          <div className={styles.textSizeSmall}>11px caption text for timestamps and hints.</div>
        </div>
        <div className={styles.markdownPreview}>
          <p><strong>Markdown support</strong> must render lists, code, and links as rich HTML.</p>
          <pre><code>const prompt = `Explain Claude-style layouts`;</code></pre>
          <ul>
            <li>Bold text</li>
            <li>Inline <code>code</code></li>
            <li>Ordered lists</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    title: 'Micro-animations',
    desc: 'Keep the UI alive with subtle motion: fade-in chat messages, a bouncing typing indicator, send button transitions, and a sliding mobile sidebar. Honor prefers-reduced-motion for accessibility.',
    preview: () => (
      <div className={styles.animationsPreview}>
        <div className={styles.animationRow}>
          <span className={styles.badgePurple}>Fade</span>
          <span>Message fade-in on appear</span>
        </div>
        <div className={styles.animationRow}>
          <span className={styles.badgeTeal}>Typing</span>
          <div className={styles.typingDots}><span /><span /><span /></div>
        </div>
        <div className={styles.animationRow}>
          <span className={styles.badgeAmber}>Button</span>
          <span>Send button color transition</span>
        </div>
        <div className={styles.animationRow}>
          <span className={styles.badgePurple}>Slide</span>
          <span>Sidebar slide in on mobile</span>
        </div>
      </div>
    ),
  },
  {
    title: 'Full assembled preview',
    desc: 'This is the complete Claude-style interface: sidebar, sticky top bar, chat bubbles, and an input bar. The last step includes the full copyable implementation code.',
    preview: (demo) => (
      <div className={styles.fullPreviewContainer}>
        <div className={styles.fullPreviewShell}>
          <div className={styles.fullSidebar}> 
            <div className={styles.fullSidebarHeader}>
              <Sparkles size={16} />
              <span>Claude-like UI</span>
            </div>
            <button className={styles.fullSidebarNew}>New chat</button>
            <div className={styles.fullSidebarSection}>Today</div>
            <div className={styles.fullSidebarChat}>Security checklist</div>
            <div className={styles.fullSidebarChat}>Project roadmap</div>
            <div className={styles.fullSidebarFooter}>
              <div className={styles.fullProfileAvatar}>JW</div>
              <div>
                <div className={styles.fullProfileName}>Jordan W.</div>
                <div className={styles.fullProfilePlan}>Free plan</div>
              </div>
            </div>
          </div>
          <div className={styles.fullChatArea}>
            <div className={styles.fullChatHeader}>
              <span>Security assistant</span>
              <div className={styles.headerActions}>
                <span className={styles.iconBox}>🔍</span>
                <span className={styles.iconBox}>⚙️</span>
              </div>
            </div>
            <div className={styles.fullChatBody}>
              <div className={styles.bubbleRowUser}>
                <div className={styles.userBubbleFull}>What are the top 3 risks in this deployment?</div>
              </div>
              <div className={styles.bubbleRowAI}>
                <div className={styles.aiAvatarSmall}>AI</div>
                <div className={styles.aiBubbleFull}>
                  Here are the top risks:
                  <ol>
                    <li>Unauthorized access to keys</li>
                    <li>Unpatched dependencies</li>
                    <li>Model prompt injection</li>
                  </ol>
                </div>
              </div>
            </div>
            <div className={styles.fullInputBar}>
              <textarea className={styles.fullInput} value={demo.demoInput} readOnly placeholder="Ask a new question..." />
              <button className={styles.fullSendButton}>Send</button>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

export default function GuidePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showCode, setShowCode] = useState(false);
  const [demoInput, setDemoInput] = useState('');

  const current = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNavigate = (direction) => {
    if (direction === 1 && isLastStep) {
      setShowCode((prev) => !prev);
      return;
    }
    setShowCode(false);
    setCurrentStep((step) => Math.max(0, Math.min(steps.length - 1, step + direction)));
  };

  const fullCodeSnippet = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Claude-like Chat UI</title>
  <style>
    :root {
      --bg-primary: #f9f8f6;
      --bg-secondary: #f1efe8;
      --bg-surface: #ffffff;
      --text-primary: #1a1916;
      --text-secondary: #6d6b67;
      --accent: #7f77dd;
      --border: #e5e3da;
      --radius-sm: 8px;
      --radius-lg: 16px;
      --space-sm: 8px;
      --space-md: 16px;
      --space-lg: 24px;
    }

    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; font-family: Inter, sans-serif; background: var(--bg-primary); color: var(--text-primary); }
    .app-shell { display: flex; height: 100vh; overflow: hidden; }
    .sidebar { width: 260px; min-width: 260px; background: var(--bg-secondary); padding: 20px; border-right: 1px solid var(--border); display: flex; flex-direction: column; }
    .sidebar .new-chat { margin-bottom: 18px; padding: 12px 14px; border-radius: 999px; border: 1px solid var(--border); background: #fff; color: var(--text-primary); font-weight: 600; cursor: pointer; }
    .sidebar .section-label { margin: 20px 0 8px; font-size: 11px; letter-spacing: 0.18em; color: var(--text-secondary); text-transform: uppercase; }
    .sidebar .chat-link { padding: 12px 14px; border-radius: 14px; background: #fff; margin-bottom: 8px; font-size: 14px; color: var(--text-primary); cursor: pointer; }
    .sidebar .profile { margin-top: auto; display: flex; align-items: center; gap: 12px; padding: 14px; border-radius: 18px; background: #fff; }
    .sidebar .avatar { width: 36px; height: 36px; border-radius: 12px; background: var(--accent); color: #fff; display: grid; place-items: center; font-weight: 700; }
    .chat-pane { flex: 1; display: flex; flex-direction: column; }
    .chat-top { padding: 18px 24px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.85); backdrop-filter: blur(18px); }
    .main-chat { flex: 1; overflow: auto; padding: 24px; display: flex; justify-content: center; }
    .conversation { width: min(720px, 100%); display: flex; flex-direction: column; gap: 14px; }
    .bubble { max-width: 75%; padding: 14px 16px; border-radius: 18px; font-size: 14px; line-height: 1.55; }
    .bubble.ai { align-self: flex-start; background: #ffffff; border: 1px solid var(--border); }
    .bubble.user { align-self: flex-end; background: var(--accent); color: #ffffff; }
    .bubble.ai code { background: #f1efff; padding: 2px 5px; border-radius: 6px; font-family: ui-monospace, SFMono-Regular, monospace; }
    .chat-input { padding: 16px 24px; border-top: 1px solid var(--border); background: rgba(255,255,255,0.95); }
    .input-row { display: flex; gap: 12px; align-items: center; }
    .input-row textarea { flex: 1; min-height: 44px; max-height: 140px; resize: vertical; border: 1px solid var(--border); border-radius: 999px; padding: 12px 16px; font-family: inherit; font-size: 14px; background: #fff; }
    .input-row button { padding: 0 18px; height: 44px; border-radius: 999px; border: none; background: var(--accent); color: #fff; cursor: pointer; transition: transform 0.2s ease, opacity 0.2s ease; }
    .input-row button:disabled { opacity: 0.45; cursor: not-allowed; background: #dcd8f8; }
    @media (max-width: 900px) { .sidebar { position: fixed; left: 0; top: 0; bottom: 0; transform: translateX(-100%); transition: transform 0.2s ease; z-index: 20; } }
  </style>
</head>
<body>
  <div class="app-shell">
    <div class="sidebar">
      <button class="new-chat">+ New chat</button>
      <div class="section-label">Today</div>
      <div class="chat-link">Summarize the latest report</div>
      <div class="chat-link">Risk assessment</div>
      <div class="section-label">Yesterday</div>
      <div class="chat-link">Audit preparation</div>
      <div class="profile"><div class="avatar">AI</div><div><strong>Security Lead</strong><div style="font-size:12px;color:#6d6b67;">Free plan</div></div></div>
    </div>
    <div class="chat-pane">
      <div class="chat-top"><strong>Security assistant</strong><div style="display:flex; gap:10px;"><span>🔍</span><span>⚙️</span></div></div>
      <div class="main-chat"><div class="conversation"><div class="bubble ai"><strong>AI:</strong> Use markdown rendering for lists and code blocks.</div><div class="bubble user">What are the top risks in this deployment?</div><div class="bubble ai"><ol><li>Unauthorized access to keys</li><li>Unpatched dependencies</li><li>Prompt injection risks</li></ol></div></div></div>
      <div class="chat-input"><div class="input-row"><textarea placeholder="Ask your assistant..."></textarea><button disabled>Send</button></div></div>
    </div>
  </div>
</body>
</html>`;

  return (
    <div className={styles.guideShell}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTitle}>Build steps</div>
        {steps.map((step, index) => (
          <button
            key={step.title}
            type="button"
            className={`${styles.stepButton} ${currentStep === index ? styles.stepButtonActive : ''}`}
            onClick={() => {
              setCurrentStep(index);
              setShowCode(false);
            }}
          >
            <span className={styles.stepNumber}>{index + 1}</span>
            <span className={styles.stepLabel}>{step.title}</span>
          </button>
        ))}
      </aside>
      <main className={styles.main}>
        <section className={styles.contentArea}>
          <div className={styles.stepHeader}>
            <div className={styles.stepMeta}>Step {currentStep + 1} of {steps.length}</div>
            <h1 className={styles.stepTitle}>{current.title}</h1>
            <p className={styles.stepDesc}>{current.desc}</p>
          </div>
          <div className={styles.previewFrame}>
            {current.preview({ demoInput, setDemoInput })}
            {isLastStep && (
              <div className={styles.fullCodeCta}>
                <p>Click the button below to reveal the complete copyable HTML/CSS/JS implementation for a Claude-style chat UI.</p>
                <button
                  type="button"
                  className={styles.revealCodeButton}
                  onClick={() => setShowCode((prev) => !prev)}
                >
                  {showCode ? 'Hide full code' : 'Get the full code ↗'}
                </button>
              </div>
            )}
            {showCode && (
              <pre className={styles.codeBlock}>
                {fullCodeSnippet}
              </pre>
            )}
          </div>
        </section>
        <div className={styles.navRow}>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => handleNavigate(-1)}
            disabled={currentStep === 0}
          >
            <ArrowLeft size={16} /> Previous
          </button>
          <div className={styles.stepCounter}>{currentStep + 1}/{steps.length}</div>
          <button
            type="button"
            className={`${styles.navButton} ${styles.primaryButton}`}
            onClick={() => handleNavigate(1)}
          >
            {isLastStep ? 'Get the full code ↗' : 'Next →'}
            <ArrowRight size={16} />
          </button>
        </div>
      </main>
    </div>
  );
}
