import { useEffect, useRef } from 'react';
import type { Contact } from '../../types';
import { formatTime } from '../../utils/chatUtils';
import { MessageBubble } from '../MessageBubble';

interface Props {
  activeChat: Contact | null;
  query: string;
  currentIdx: number;
  matchIds: string[];
  hasQuery: boolean;
  isSearchOpen: boolean;
}

export function MessageList({ activeChat, query, currentIdx, matchIds, hasQuery, isSearchOpen }: Props) {
  const listRef = useRef<HTMLDivElement>(null);
  const messages = activeChat?.messages ?? [];

  useEffect(() => {
    if (listRef.current && !hasQuery && !isSearchOpen) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages.length, hasQuery, isSearchOpen]);

  useEffect(() => {
    if (!hasQuery || matchIds.length === 0) return;
    const el = document.getElementById(`msg-${matchIds[currentIdx]}`);
    if (el && listRef.current) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentIdx, matchIds, hasQuery]);

  return (
    <div className="messages" ref={listRef}>
      {messages.length === 0 && (
        <div className="messages-empty">Сообщений пока нет. Отправьте первое сообщение.</div>
      )}
      {hasQuery && matchIds.length === 0 && (
        <div className="messages-empty">Сообщений с «{query.trim()}» не найдено</div>
      )}
      {messages.map((m) => (
        <MessageBubble
          key={m.id}
          message={m}
          time={formatTime(m.timestamp)}
          query={query}
        />
      ))}
    </div>
  );
}