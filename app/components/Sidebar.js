'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { signOut } from 'next-auth/react';
import { Plus, MessageSquare, Trash2, Edit2, LogOut, Settings, MoreHorizontal } from 'lucide-react';
import styles from './Sidebar.module.css';

export default function Sidebar({
  conversations,
  activeId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onRenameConversation,
  onOpenSettings,
  isLoading,
  session,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const editInputRef = useRef(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Close profile menu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    }
    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileMenuOpen]);

  // Focus input when entering edit mode
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  const handleStartRename = (e, convo) => {
    e.stopPropagation();
    setEditingId(convo._id);
    setEditTitle(convo.title);
  };

  const handleSaveRename = (id) => {
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      handleSaveRename(id);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  // Group conversations by date
  const groupedConversations = useMemo(() => {
    const today = [];
    const yesterday = [];
    const last7 = [];
    const earlier = [];

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    const startOf7Days = new Date(startOfToday);
    startOf7Days.setDate(startOf7Days.getDate() - 7);

    conversations.forEach((convo) => {
      const timestamp = convo.updatedAt || convo.createdAt;
      const date = timestamp ? new Date(timestamp) : null;

      if (!date || Number.isNaN(date.getTime())) {
        earlier.push(convo);
        return;
      }

      if (date >= startOfToday) {
        today.push(convo);
      } else if (date >= startOfYesterday) {
        yesterday.push(convo);
      } else if (date >= startOf7Days) {
        last7.push(convo);
      } else {
        earlier.push(convo);
      }
    });

    return { Today: today, Yesterday: yesterday, 'Last 7 days': last7, Earlier: earlier };
  }, [conversations]);

  const userName = session?.user?.name || session?.user?.email || 'User';
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
  const userAvatar = session?.user?.image;

  return (
    <aside className={styles.sidebar}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>✦</div>
          <span>OddAI</span>
        </div>
        <button
          className={styles.headerIconBtn}
          title="Close sidebar"
          onClick={() => {
            // This will be handled by parent on mobile
          }}
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
      </div>

      {/* New chat button */}
      <button className={styles.newChatBtn} onClick={() => onNewChat()} type="button">
        <Plus size={14} />
        New chat
      </button>

      {/* Conversation history */}
      <div className={styles.threadSection}>
        {isLoading ? (
          <div className={styles.loaderContainer}>
            <div className={styles.loaderSpinner} />
            <span>Loading chats...</span>
          </div>
        ) : conversations.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No conversations yet.</p>
            <p className={styles.emptyStateHint}>Your chat history will appear here.</p>
          </div>
        ) : (
          Object.entries(groupedConversations).map(([heading, items]) =>
            items.length > 0 ? (
              <div key={heading} className={styles.sectionGroup}>
                <div className={styles.sectionHeader}>{heading}</div>
                {items.map((convo) => {
                  const isActive = convo._id === activeId;
                  const isEditing = convo._id === editingId;

                  return (
                    <div
                      key={convo._id}
                      className={`${styles.threadItem} ${isActive ? styles.activeItem : ''}`}
                      onClick={() => !isEditing && onSelectConversation(convo._id)}
                      onDoubleClick={(e) => !isEditing && handleStartRename(e, convo)}
                    >
                      <MessageSquare size={16} className={styles.threadIcon} />
                      {isEditing ? (
                        <input
                          ref={editInputRef}
                          type="text"
                          className={styles.renameInput}
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onBlur={() => handleSaveRename(convo._id)}
                          onKeyDown={(e) => handleKeyDown(e, convo._id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span className={styles.threadTitle} title={convo.title}>
                          {convo.title}
                        </span>
                      )}
                      {!isEditing && (
                        <div className={styles.itemActions}>
                          <button
                            className={styles.actionBtn}
                            onClick={(e) => handleStartRename(e, convo)}
                            title="Rename"
                            type="button"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            className={`${styles.actionBtn} ${styles.deleteAction}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Delete this conversation?')) {
                                onDeleteConversation(convo._id);
                              }
                            }}
                            title="Delete"
                            type="button"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : null
          )
        )}
      </div>

      {/* User profile footer */}
      <div className={styles.footer} ref={profileMenuRef}>
        {isProfileMenuOpen && (
          <div className={styles.profileMenu}>
            <button
              onClick={() => {
                onOpenSettings();
                setIsProfileMenuOpen(false);
              }}
              className={styles.menuItem}
              type="button"
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className={`${styles.menuItem} ${styles.logoutBtn}`}
              type="button"
            >
              <LogOut size={16} />
              <span>Log out</span>
            </button>
          </div>
        )}
        <div
          className={styles.profilePill}
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        >
          {userAvatar ? (
            <img src={userAvatar} alt={userName} className={styles.userAvatarPlaceholder} style={{ objectFit: 'cover' }} />
          ) : (
            <div className={styles.userAvatarPlaceholder}>{userInitials}</div>
          )}
          <div className={styles.userDetails}>
            <span className={styles.userName} title={userName}>
              {userName}
            </span>
            <span className={styles.userPlan}>Free plan</span>
          </div>
          <button
            className={styles.actionBtn}
            title="More"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsProfileMenuOpen(!isProfileMenuOpen);
            }}
          >
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
