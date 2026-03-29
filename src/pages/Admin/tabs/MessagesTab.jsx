import React from 'react';
import './MessagesTab.css';

export default function MessagesTab({ data }) {
  return (
    <div>
      <h2 className="tab-heading">Contact Messages ({(data || []).length})</h2>
      <div className="msgs-list">
        {(data || []).length === 0 && (
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>No messages yet.</p>
        )}
        {(data || []).map((msg) => (
          <div key={msg.id} className="msg-card">
            <div className="msg-top">
              <span className="msg-name">{msg.name}</span>
              <span className="msg-email">{msg.email}</span>
              <span className="msg-date">{new Date(msg.sent_at).toLocaleDateString('en-IN')}</span>
            </div>
            <p className="msg-body">{msg.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
