'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Sparkles, Code, Brain, Cpu } from 'lucide-react';
import { FREE_MODELS, getModelInfo } from '../../lib/models';
import styles from './ModelSelector.module.css';

export default function ModelSelector({ selectedModel, onModelChange, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeModel = getModelInfo(selectedModel) || FREE_MODELS[0];

  // Helper to get Lucide icon mapping for category if needed, or fallback to the emoji
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'auto':
        return <Sparkles className={styles.categoryIcon} size={16} />;
      case 'coding':
        return <Code className={styles.categoryIcon} size={16} />;
      case 'reasoning':
        return <Brain className={styles.categoryIcon} size={16} />;
      default:
        return <Cpu className={styles.categoryIcon} size={16} />;
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (modelId) => {
    onModelChange(modelId);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={styles.container}>
      <button
        type="button"
        className={`${styles.trigger} ${isOpen ? styles.active : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={styles.modelIcon}>{activeModel.icon}</span>
        <div className={styles.triggerInfo}>
          <span className={styles.triggerName}>{activeModel.name}</span>
        </div>
        <ChevronDown className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} size={16} />
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu} role="listbox">
          <div className={styles.menuHeader}>Select AI Model</div>
          <div className={styles.menuList}>
            {FREE_MODELS.map((model) => {
              const isSelected = model.id === selectedModel;
              return (
                <button
                  key={model.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`${styles.menuItem} ${isSelected ? styles.selectedItem : ''}`}
                  onClick={() => handleSelect(model.id)}
                >
                  <span className={styles.itemIcon}>{model.icon}</span>
                  <div className={styles.itemText}>
                    <div className={styles.itemNameRow}>
                      <span className={styles.itemName}>{model.name}</span>
                      {model.category && (
                        <span className={`${styles.badge} ${styles[model.category]}`}>
                          {model.category}
                        </span>
                      )}
                    </div>
                    <span className={styles.itemDesc}>{model.description}</span>
                  </div>
                  {isSelected && <Check className={styles.checkIcon} size={16} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
