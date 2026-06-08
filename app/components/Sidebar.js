'use client';

import React, { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { Plus, MessageSquare, Trash2, Edit2, LogOut, Settings, Check, X, Menu } from 'lucide-react';
import { getModelInfo } from '../../lib/models';
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

  // Focus the input when entering edit mode
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

  // Get user details
  const userName = session?.user?.name || session?.user?.email || 'AI Assistant User';
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
  const userAvatar = session?.user?.image;

  return (
    <aside className={styles.sidebar}>
      {/* Sidebar Header */}
      <div className={styles.header}>
        <div className={styles.logoRow}>
          <div className={styles.logoDot} />
          <span className={styles.logoText}>OddAI Hub</span>
        </div>
        <button
          className={styles.newChatBtn}
          onClick={() => onNewChat()}
          title="Start a new chat session"
        >
          <Plus size={18} />
          <span>New Chat</span>
        </button>
      </div>

      {/* Conversations List */}
      <div className={styles.threadSection}>
        <div className={styles.sectionHeader}>Recent Conversations</div>
        
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
          <div className={styles.threadList}>
            {conversations.map((convo) => {
              const isActive = convo._id === activeId;
              const isEditing = convo._id === editingId;
              const modelInfo = getModelInfo(convo.model);

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
                    <div className={styles.threadDetails}>
                      <span className={styles.threadTitle} title={convo.title}>
                        {convo.title}
                      </span>
                      {modelInfo && (
                        <span className={styles.threadModelBadge}>
                          {modelInfo.icon} {modelInfo.name.split(' ')[0]}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions overlay */}
                  {!isEditing && (
                    <div className={styles.itemActions}>
                      <button
                        className={styles.actionBtn}
                        onClick={(e) => handleStartRename(e, convo)}
                        title="Rename conversation"
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
                        title="Delete conversation"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* User Profile Footer */}
      <div className={styles.footer}>
        <div className={styles.userProfile}>
          {userAvatar ? (
            <img src={userAvatar} alt={userName} className={styles.userAvatarImage} />
          ) : (
            <div className={styles.userAvatarPlaceholder}>{userInitials}</div>
          )}
          <div className={styles.userInfo}>
            <span className={styles.userName} title={userName}>
              {userName}
            </span>
          </div>
        </div>

        <div className={styles.footerActions}>
          <button
            className={styles.footerBtn}
            onClick={onOpenSettings}
            title="Open configuration settings"
          >
            <Settings size={18} />
          </button>
          <button
            className={`${styles.footerBtn} ${styles.logoutBtn}`}
            onClick={() => signOut({ callbackUrl: '/login' })}
            title="Log out of session"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
