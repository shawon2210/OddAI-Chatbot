import { Sparkles } from 'lucide-react';

export default function Loading() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      color: 'var(--text-secondary)',
      padding: '24px',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '14px',
        padding: '28px',
        borderRadius: '20px',
        background: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: 'var(--shadow-xl)',
      }}>
        <Sparkles size={40} style={{ color: 'var(--accent)' }} />
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="spinner" style={{ width: 24, height: 24, border: '3px solid rgba(255, 255, 255, 0.15)', borderTop: '3px solid var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 500 }}>Loading registration screen…</span>
        </div>
      </div>
    </div>
  );
}
