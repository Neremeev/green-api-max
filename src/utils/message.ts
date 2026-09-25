import type { Message } from '../types';

export function createMessage(
  chatId: string,
  text: string,
  fromMe: boolean,
  status: Message['status']
): Message {
  return {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    chatId,
    text,
    fromMe,
    timestamp: Date.now(),
    status,
  };
}