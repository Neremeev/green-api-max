import type { Contact, Message, NotificationBody } from '../types';
import { normalizePhone } from '../utils/chatUtils';

export interface ParsedNotification {
  contact: Contact;
  message: Message;
}

export function parseNotification(body: NotificationBody): ParsedNotification | null {
  const isOutgoing = body.typeWebhook === 'outgoingMessageReceived';
  const isIncoming = body.typeWebhook === 'incomingMessageReceived';
  if (!isIncoming && !isOutgoing) return null;

  const text =
    body.messageData?.textMessageData?.textMessage ??
    body.messageData?.extendedTextMessageData?.text ??
    body.messageData?.buttonsMessage?.contentText;

  if (text === undefined || text === null || !text.trim()) return null;

  const chatId = body.senderData?.chatId;
  const chatName = body.senderData?.chatName;
  if (!chatId) return null;

  const fromChatId = chatId.replace(/@[a-z]+$/i, '');
  const phone = normalizePhone(fromChatId) || (body.senderData?.senderPhoneNumber
    ? String(body.senderData.senderPhoneNumber)
    : fromChatId);

  const timestamp = (body.timestamp ?? Math.floor(Date.now() / 1000)) * 1000;

  return {
    contact: {
      phone,
      name: chatName,
      messages: [],
    },
    message: {
      id: body.idMessage ?? `${timestamp}-${phone}`,
      chatId: phone,
      text,
      fromMe: isOutgoing,
      timestamp,
      status: 'sent',
    },
  };
}