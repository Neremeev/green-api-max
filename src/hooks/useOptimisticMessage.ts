import { useCallback } from 'react';
import type { Contact, Credentials, Message } from '../types';
import { upsertMessage } from '../utils/chatUtils';
import { toChatId } from '../utils/chatUtils';
import { createMessage } from '../utils/message';
import { GreenApiClient } from '../api/greenApi';

interface Options {
  contacts: Contact[];
  credentials: Credentials | null;
  activePhone: string | null;
  setContacts: (contacts: Contact[]) => void;
  onError: (message: string) => void;
}

export function useOptimisticMessage({
  contacts,
  credentials,
  activePhone,
  setContacts,
  onError,
}: Options) {
  return useCallback(
    async (text: string) => {
      if (!credentials || !activePhone) return;
      const trimmed = text.trim();
      if (!trimmed) return;

      const client = new GreenApiClient(credentials);
      const pending = createMessage(activePhone, trimmed, true, 'pending');
      setContacts(upsertMessage(contacts, activePhone, pending));

      const applyStatus = (status: Message['status']) =>
        setContacts(upsertMessage(contacts, activePhone, { ...pending, status }));

      try {
        await client.sendMessage(toChatId(activePhone), trimmed);
        applyStatus('sent');
      } catch (e) {
        applyStatus('error');
        onError(`Не удалось отправить сообщение: ${(e as Error).message}`);
      }
    },
    [contacts, credentials, activePhone, setContacts, onError]
  );
}