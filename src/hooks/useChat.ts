import { useEffect } from 'react';
import { useChatStore } from '../store/chatStore';
import { useOptimisticMessage } from './useOptimisticMessage';
import type { Contact, Credentials } from '../types';

const POLL_DELAY = 1000;

export function useChat() {
  const credentials = useChatStore((s) => s.credentials);
  const contacts = useChatStore((s) => s.contacts);
  const activePhone = useChatStore((s) => s.activePhone);
  const isConnected = useChatStore((s) => s.isConnected);
  const error = useChatStore((s) => s.error);
  const connect = useChatStore((s) => s.connect);
  const disconnect = useChatStore((s) => s.disconnect);
  const selectChat = useChatStore((s) => s.selectChat);
  const addContact = useChatStore((s) => s.addContact);
  const setContacts = useChatStore((s) => s.setContacts);
  const setError = useChatStore((s) => s.setError);
  const receiveNotification = useChatStore((s) => s.receiveNotification);

  const sendMessage = useOptimisticMessage({
    contacts,
    credentials,
    activePhone,
    setContacts,
    onError: setError,
  });

  useEffect(() => {
    if (!credentials) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const poll = async () => {
      if (cancelled) return;
      try {
        await receiveNotification();
      } catch (e) {
        if (!cancelled) setError(`Ошибка получения сообщений: ${(e as Error).message}`);
      } finally {
        if (!cancelled) {
          timer = setTimeout(poll, POLL_DELAY);
        }
      }
    };

    poll();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [credentials, receiveNotification, setError]);

  const activeChat: Contact | null =
    contacts.find((c) => c.phone === activePhone) ?? null;

  return {
    contacts,
    activeChat,
    isConnected,
    error,
    connect: (creds: Credentials) => connect(creds),
    disconnect,
    selectChat,
    addContact,
    sendMessage,
  };
}