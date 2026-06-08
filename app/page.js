'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import SettingsModal from './components/SettingsModal';
import { useTheme } from './components/ClientProviders';
import styles from './page.module.css'; // Let's create a minimal orchestrator layout stylesheet too

export default function Home() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // Conversations list & Active state
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  
  // Loading & Streaming states
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  // Settings state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userSettings, setUserSettings] = useState({
    theme: 'dark',
    selectedModel: 'openrouter/free',
    systemPrompt: '',
    customApiKey: '',
  });

  // Sidebar visibility on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Ref for stream abort control
  const abortControllerRef = useRef(null);

  // Redirect if unauthenticated (fallback to middleware)
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Sync settings when session is loaded
  useEffect(() => {
    if (session?.user?.settings) {
      const settings = session.user.settings;
      setUserSettings({
        theme: settings.theme || 'dark',
        selectedModel: settings.selectedModel || 'openrouter/free',
        systemPrompt: settings.systemPrompt || '',
        customApiKey: settings.customApiKey || '',
      });
      // Synchronize client-side theme
      if (settings.theme && settings.theme !== theme) {
        setTheme(settings.theme);
      }
    }
  }, [session, theme, setTheme]);

  // Load conversations on mount
  useEffect(() => {
    if (status === 'authenticated') {
      fetchConversations();
    }
  }, [status]);

  // Default sidebar behavior by viewport width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load active conversation messages when activeId changes
  useEffect(() => {
    if (activeId) {
      fetchConversationDetails(activeId);
    } else {
      setActiveConversation(null);
      setMessages([]);
    }
  }, [activeId]);

  const fetchConversations = async () => {
    try {
      setIsLoadingConversations(true);
      const res = await fetch('/api/conversations', { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (e) {
      console.error('Error fetching conversations:', e);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const fetchConversationDetails = async (id) => {
    try {
      setIsLoadingMessages(true);
      const res = await fetch(`/api/conversations/${id}`, { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setActiveConversation(data);
        setMessages(data.messages || []);
      }
    } catch (e) {
      console.error('Error fetching conversation details:', e);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleNewChat = async (modelId) => {
    try {
      const selectedModel = modelId || userSettings.selectedModel || 'openrouter/free';
      const res = await fetch('/api/conversations', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: selectedModel }),
      });

      if (res.ok) {
        const newChat = await res.json();
        setConversations((prev) => [newChat, ...prev]);
        setActiveId(newChat._id);
        // On mobile, close sidebar automatically when starting a chat
        if (window.innerWidth <= 768) {
          setIsSidebarOpen(false);
        }
      }
    } catch (e) {
      console.error('Error creating new chat:', e);
    }
  };

  const handleDeleteChat = async (id) => {
    try {
      const res = await fetch(`/api/conversations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setConversations((prev) => prev.filter((c) => c._id !== id));
        if (activeId === id) {
          setActiveId(null);
        }
      }
    } catch (e) {
      console.error('Error deleting chat:', e);
    }
  };

  const handleRenameChat = async (id, newTitle) => {
    if (!newTitle.trim()) return;
    try {
      const res = await fetch(`/api/conversations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });
      if (res.ok) {
        setConversations((prev) =>
          prev.map((c) => (c._id === id ? { ...c, title: newTitle } : c))
        );
        if (activeId === id) {
          setActiveConversation((prev) => ({ ...prev, title: newTitle }));
        }
      }
    } catch (e) {
      console.error('Error renaming chat:', e);
    }
  };

  const handleUpdateSettings = async (updatedFields) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });

      if (res.ok) {
        const data = await res.json();
        setUserSettings((prev) => ({ ...prev, ...updatedFields }));
        
        // Propagate theme changes
        if (updatedFields.theme) {
          setTheme(updatedFields.theme);
        }

        // Update NextAuth Session locally
        await updateSession({
          ...session,
          user: {
            ...session.user,
            settings: {
              ...session.user.settings,
              ...updatedFields,
            },
          },
        });
      }
    } catch (e) {
      console.error('Error updating settings:', e);
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    if (status !== 'authenticated') {
      router.push('/login');
      return;
    }

    let currentConversationId = activeId;

    // 1. Auto-create a conversation if none is active
    if (!currentConversationId) {
      try {
        const selectedModel = userSettings.selectedModel || 'openrouter/free';
        const res = await fetch('/api/conversations', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: selectedModel }),
        });

        if (res.ok) {
          const newChat = await res.json();
          currentConversationId = newChat._id;
          setActiveId(newChat._id);
          setActiveConversation(newChat);
          setConversations((prev) => [newChat, ...prev]);
        } else {
          const errorBody = await res.json().catch(() => null);
          console.error('Failed to auto-create conversation', res.status, errorBody);
          return;
        }
      } catch (e) {
        console.error('Error creating chat on message:', e);
        return;
      }
    }

    const userMessage = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    // Construct the messages payload
    const conversationRef = conversations.find((c) => c._id === currentConversationId);
    const modelToUse = conversationRef?.model || userSettings.selectedModel || 'openrouter/free';
    
    // Add user message to state
    const newMessagesList = [...messages, userMessage];
    setMessages(newMessagesList);
    
    // Add temporary assistant loading message
    const assistantTempId = Math.random().toString(36).substring(7);
    const tempAssistantMessage = {
      id: assistantTempId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      isStreaming: true,
    };
    
    setMessages((prev) => [...prev, tempAssistantMessage]);
    setIsStreaming(true);

    // Save user message to database immediately
    try {
      await fetch(`/api/conversations/${currentConversationId}`, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessagesList.map(m => ({
            id: m.id,
            role: m.role,
            content: m.content,
            timestamp: m.timestamp,
          })),
          // Auto rename if it's the first message and title is "New Chat"
          ...(conversationRef?.title === 'New Chat' ? { title: text.substring(0, 30) + (text.length > 30 ? '...' : '') } : {}),
        }),
      });

      // Update sidebar title locally if renamed
      if (conversationRef?.title === 'New Chat') {
        const newTitle = text.substring(0, 30) + (text.length > 30 ? '...' : '');
        setConversations((prev) =>
          prev.map((c) => (c._id === currentConversationId ? { ...c, title: newTitle } : c))
        );
      }
    } catch (e) {
      console.error('Error saving user message to database:', e);
    }

    // Prepare API history stream
    const apiMessagesHistory = [];
    if (userSettings.systemPrompt) {
      apiMessagesHistory.push({ role: 'system', content: userSettings.systemPrompt });
    }
    
    newMessagesList.forEach((msg) => {
      apiMessagesHistory.push({ role: msg.role, content: msg.content });
    });

    // Setup AbortController
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessagesHistory,
          model: modelToUse,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to generate response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        
        // OpenRouter returns Server-Sent Events (data: ...)
        const lines = chunk.split('\n');
        for (const line of lines) {
          const cleanedLine = line.trim();
          if (!cleanedLine || cleanedLine === 'data: [DONE]') continue;

          if (cleanedLine.startsWith('data: ')) {
            try {
              const data = JSON.parse(cleanedLine.substring(6));
              const content = data.choices?.[0]?.delta?.content || '';
              assistantResponse += content;
              
              // Stream incrementally to UI
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantTempId
                    ? { ...m, content: assistantResponse }
                    : m
                )
              );
            } catch (err) {
              // Ignore partial JSON parsing errors
            }
          }
        }
      }

      // 2. Stream complete! Save assistant response to DB
      const finalAssistantMessage = {
        id: assistantTempId,
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date().toISOString(),
      };

      const finalMessagesList = [...newMessagesList, finalAssistantMessage];
      
      // Update local state (strip isStreaming flag)
      setMessages(finalMessagesList);

      await fetch(`/api/conversations/${currentConversationId}`, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: finalMessagesList.map(m => ({
            id: m.id,
            role: m.role,
            content: m.content,
            timestamp: m.timestamp,
          })),
        }),
      });

      // Trigger conversations list refresh to reorder threads
      fetchConversations();

    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Generation stopped by user');
      } else {
        console.error('Streaming error:', err);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantTempId
              ? { ...m, content: `Error: ${err.message || 'Failed to complete reply.'}`, isError: true }
              : m
          )
        );
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  if (status === 'loading') {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading application...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Will redirect via useEffect
  }

  return (
    <div className={styles.appShell}>
      {/* Top app bar */}
      <div className={styles.topBar}>
        <div className={styles.brandSection}>
          <div className={styles.brandLogo}>OddAI</div>
          <div>
            <h1 className={styles.brandTitle}>OddAI Assistant</h1>
            <p className={styles.brandSubtitle}>A modern chat experience for industrial surveillance and safety.</p>
          </div>
        </div>

        <div className={styles.appBarActions}>
          <button className={styles.appBarBtn} onClick={() => handleNewChat()}>
            New chat
          </button>
          <button className={styles.appBarBtn} onClick={() => setIsSettingsOpen(true)}>
            Settings
          </button>
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* Sidebar Toggle for Mobile */}
        <button
          className={styles.sidebarToggle}
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          ☰
        </button>

        {/* Mobile sidebar backdrop */}
        <div
          className={`${styles.sidebarBackdrop} ${isSidebarOpen ? styles.backdropVisible : ''}`}
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />

        {/* Main Sidebar */}
        <div className={`${styles.sidebarWrapper} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
          <Sidebar
            conversations={conversations}
          activeId={activeId}
          onSelectConversation={(id) => {
            setActiveId(id);
            // Auto close sidebar on mobile after selecting
            if (window.innerWidth <= 768) {
              setIsSidebarOpen(false);
            }
          }}
          onNewChat={handleNewChat}
          onDeleteConversation={handleDeleteChat}
          onRenameConversation={handleRenameChat}
          onOpenSettings={() => {
            setIsSettingsOpen(true);
            if (window.innerWidth <= 768) {
              setIsSidebarOpen(false);
            }
          }}
          isLoading={isLoadingConversations}
          session={session}
        />
      </div>

      {/* Main Chat Pane */}
      <div className={styles.chatWrapper}>
        <ChatArea
          messages={messages}
          activeConversation={activeConversation}
          onSendMessage={handleSendMessage}
          isStreaming={isStreaming}
          onStopGeneration={handleStopGeneration}
          isLoadingMessages={isLoadingMessages}
          selectedModel={userSettings.selectedModel}
          onModelChange={(modelId) => handleUpdateSettings({ selectedModel: modelId })}
        />
      </div>

      {/* Settings Dialog Overlay */}
      {isSettingsOpen && (
        <SettingsModal
          settings={userSettings}
          onSave={handleUpdateSettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  </div>
  );
}
