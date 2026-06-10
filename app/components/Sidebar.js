'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import {
  Plus, Trash2, Edit2, LogOut, Settings,
  MoreHorizontal, Search, PenSquare,
} from 'lucide-react';
import styles from './Sidebar.module.css';

export default function Sidebar({
  conversations,
  activeId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onRenameConversation,
  onOpenSettings,
  onCloseSidebar,
  isLoading,
  session,
}) {
  const [editingId, setEditingId]         = useState(null);
  const [editTitle, setEditTitle]         = useState('');
  const [profileOpen, setProfileOpen]     = useState(false);
  const editInputRef  = useRef(null);
  const profileRef    = useRef(null);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [profileOpen]);

  const handleStartRename = (e, convo) => {
    e.stopPropagation();
    setEditingId(convo._id);
    setEditTitle(convo.title);
  };

  const handleSaveRename = (id) => {
    if (editTitle.trim()) onRenameConversation(id, editTitle.trim());
    setEditingId(null);
  };

  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter') handleSaveRename(id);
    else if (e.key === 'Escape') setEditingId(null);
  };

  const grouped = useMemo(() => {
    const now   = new Date();
    const sod   = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const soy   = new Date(sod); soy.setDate(soy.getDate() - 1);
    const so7   = new Date(sod); so7.setDate(so7.getDate() - 7);
    const so30  = new Date(sod); so30.setDate(so30.getDate() - 30);

    const buckets = { Today: [], Yesterday: [], 'Previous 7 days': [], 'Previous 30 days': [], Earlier: [] };

    conversations.forEach((c) => {
      const d = new Date(c.updatedAt || c.createdAt);
      if      (d >= sod)  buckets['Today'].push(c);
      else if (d >= soy)  buckets['Yesterday'].push(c);
      else if (d >= so7)  buckets['Previous 7 days'].push(c);
      else if (d >= so30) buckets['Previous 30 days'].push(c);
      else                buckets['Earlier'].push(c);
    });

    return buckets;
  }, [conversations]);

  const userName    = session?.user?.name || session?.user?.email || 'User';
  const userInitial = userName.trim()[0]?.toUpperCase() || 'U';
  const userAvatar  = session?.user?.image;

  return (
    <nav className={styles.sidebar}>
      {/* Top icon row */}
      <div className={styles.topActions}>
        <button
          className={styles.iconBtn}
          onClick={onCloseSidebar}
          title="Close sidebar"
          type="button"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M9 3v18"/>
          </svg>
        </button>

        <button
          className={styles.iconBtn}
          onClick={() => onNewChat()}
          title="New chat"
          type="button"
        >
          <PenSquare size={18} />
        </button>
      </div>

      {/* Thread list */}
      <div className={styles.threadList}>
        {isLoading ? (
          <div className={styles.loaderWrap}>
            <div className={styles.loaderSpinner} />
            <span>Loading…</span>
          </div>
        ) : conversations.length === 0 ? (
          <div className={styles.emptyState}>No conversations yet</div>
        ) : (
          Object.entries(grouped).map(([label, items]) =>
            items.length === 0 ? null : (
              <div key={label} className={styles.sectionGroup}>
                <div className={styles.sectionLabel}>{label}</div>
                {items.map((convo) => {
                  const isActive  = convo._id === activeId;
                  const isEditing = convo._id === editingId;
                  return (
                    <div
                      key={convo._id}
                      className={`${styles.threadItem} ${isActive ? styles.activeThread : ''}`}
                      onClick={() => !isEditing && onSelectConversation(convo._id)}
                    >
                      {isEditing ? (
                        <input
                          ref={editInputRef}
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
                            <Edit2 size={14} />
                          </button>
                          <button
                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Delete this conversation?')) onDeleteConversation(convo._id);
                            }}
                            title="Delete"
                            type="button"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          )
        )}
      </div>

      {/* Footer / profile */}
      <div className={styles.footer} ref={profileRef}>
        {profileOpen && (
          <div className={styles.profileMenu}>
            <button
              className={styles.menuItem}
              onClick={() => { onOpenSettings(); setProfileOpen(false); }}
              type="button"
            >
              <Settings size={16} /> Settings
            </button>
            <div className={styles.menuDivider} />
            <button
              className={`${styles.menuItem} ${styles.logoutItem}`}
              onClick={() => signOut({ callbackUrl: '/login' })}
              type="button"
            >
              <LogOut size={16} /> Log out
            </button>
          </div>
        )}

        <div className={styles.profileRow} onClick={() => setProfileOpen((p) => !p)}>
          <div className={styles.avatar}>
            {userAvatar ? <Image src={userAvatar} alt={userName} width={32} height={32} /> : userInitial}
          </div>
          <span className={styles.userName}>{userName}</span>
          <MoreHorizontal size={16} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
        </div>
      </div>
    </nav>
  );
}
