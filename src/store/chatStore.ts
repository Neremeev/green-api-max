import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Contact, Credentials } from '../types';
import { upsertMessage } from '../utils/chatUtils';
import { GreenApiClient } from '../api/greenApi';
import { parseNotification } from '../services/notificationParser';

interface ChatState {
  credentials: Credentials | null;
  contacts: Contact[];
  activePhone: string | null;
  isConnected: boolean;
  error: string | null;
  connect: (creds: Credentials) => void;
  disconnect: () => void;
  selectChat: (phone: string) => void;
  addContact: (phone: string) => void;
  setContacts: (contacts: Contact[]) => void;
  setError: (message: string | null) => void;
  receiveNotification: () => Promise<boolean>;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      credentials: null,
      contacts: [],
      activePhone: null,
      isConnected: false,
      error: null,

      connect: (creds) => {
        set({
          credentials: creds,
          contacts: [],
          activePhone: null,
          isConnected: true,
          error: null,
        });
      },

      disconnect: () => {
        set({ credentials: null, isConnected: false });
      },

      selectChat: (phone) => set({ activePhone: phone }),

      addContact: (phone) => {
        const { contacts } = get();
        if (contacts.some((c) => c.phone === phone)) {
          set({ activePhone: phone });
          return;
        }
        set({ contacts: [...contacts, { phone, messages: [] }], activePhone: phone });
      },

      setContacts: (contacts) => set({ contacts }),

      setError: (message) => set({ error: message }),

      receiveNotification: async () => {
        const { credentials, contacts } = get();
        if (!credentials) return false;

        const client = new GreenApiClient(credentials);
        const notification = await client.receiveNotification();

        if (!notification) return false;

        const parsed = parseNotification(notification.body);
        if (parsed) {
          const { contact, message } = parsed;
          const existing = contacts.some((c) => c.phone === contact.phone);
          const next = existing
            ? upsertMessage(contacts, contact.phone, message)
            : [
                ...contacts,
                { phone: contact.phone, name: contact.name, messages: [message] },
              ];
          set({ contacts: next });
        }

        await client.deleteNotification(notification.receiptId);
        return true;
      },
    }),
    {
      name: 'green-api-chat',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' && window.localStorage
          ? window.localStorage
          : createMemoryStorage()
      ),
      partialize: (state) => ({
        credentials: state.credentials,
        contacts: state.contacts,
        activePhone: state.activePhone,
        isConnected: state.isConnected,
      }),
    }
  )
);

function createMemoryStorage() {
  let data: Record<string, string> = {};
  return {
    getItem: (name: string) => data[name] ?? null,
    setItem: (name: string, value: string) => {
      data[name] = value;
    },
    removeItem: (name: string) => {
      delete data[name];
    },
  };
}
