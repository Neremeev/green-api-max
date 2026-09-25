import { useMemo, useState } from 'react';
import type { Contact } from '../types';
import { PersonIcon } from './icons';

interface UseChatShape {
  contacts: Contact[];
  activeChat: Contact | null;
  isConnected: boolean;
  selectChat: (phone: string) => void;
  addContact: (phone: string) => void;
}

interface Props {
  chat: UseChatShape;
  onNewChat: () => void;
}

export function Sidebar({ chat, onNewChat }: Props) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return chat.contacts;
    return chat.contacts.filter((c) => {
      const name = (c.name || '').toLowerCase();
      const phone = c.phone.toLowerCase();
      return name.includes(q) || phone.includes(q);
    });
  }, [chat.contacts, query]);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">Чаты</span>
        <button className="btn btn-small" onClick={onNewChat}>
          +
        </button>
      </div>

      <div className="sidebar-search">
        <input
          className="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по чатам"
        />
      </div>

      <ul className="chat-list">
        {chat.contacts.length === 0 && (
          <li className="chat-list-empty">Чатов пока нет</li>
        )}
        {chat.contacts.length > 0 && filtered.length === 0 && (
          <li className="chat-list-empty">Ничего не найдено</li>
        )}
        {filtered.map((c) => (
          <li
            key={c.phone}
            className={`chat-item ${chat.activeChat?.phone === c.phone ? 'active' : ''}`}
            onClick={() => chat.selectChat(c.phone)}
          >
            <div className="avatar">
              <PersonIcon size={22} />
            </div>
            <div className="chat-item-info">
              <span className="chat-item-name">{c.name ? c.name : `+${c.phone}`}</span>
              <span className="chat-item-preview">
                {c.messages.length > 0
                  ? c.messages[c.messages.length - 1].text
                  : 'Нет сообщений'}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
