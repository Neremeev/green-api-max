import { useMemo, useState } from 'react';
import type { Message } from '../types';

interface Options {
  messages: Message[];
}

export function useMessageSearch({ messages }: Options) {
  const [query, setQuery] = useState('');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const matchIds = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as string[];
    return messages.filter((m) => m.text.toLowerCase().includes(q)).map((m) => m.id);
  }, [messages, query]);

  const hasQuery = query.trim().length > 0;
  const total = matchIds.length;

  const updateQuery = (value: string) => {
    setQuery(value);
    setCurrentIdx(0);
  };

  const goPrev = () => {
    setCurrentIdx((i) => (i - 1 + total) % total);
  };

  const goNext = () => {
    setCurrentIdx((i) => (i + 1) % total);
  };

  const open = () => setIsSearchOpen(true);

  const close = () => {
    setQuery('');
    setCurrentIdx(0);
    setIsSearchOpen(false);
  };

  return {
    query,
    currentIdx,
    total,
    matchIds,
    hasQuery,
    isSearchOpen,
    updateQuery,
    goPrev,
    goNext,
    open,
    close,
  };
}