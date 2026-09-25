import { describe, expect, it } from 'vitest';
import { parseNotification } from './notificationParser';
import type { NotificationBody } from '../types';

describe('parseNotification', () => {
  it('возвращает null для не-сообщений', () => {
    const body = { typeWebhook: 'messageReceipt' } as NotificationBody;
    expect(parseNotification(body)).toBeNull();
  });

  it('парсит входящее текстовое сообщение', () => {
    const body: NotificationBody = {
      typeWebhook: 'incomingMessageReceived',
      idMessage: '123',
      timestamp: 1790332349,
      senderData: { chatId: '79279791116@c.us', chatName: 'Николай' },
      messageData: {
        typeMessage: 'textMessage',
        textMessageData: { textMessage: 'Привет' },
      },
    };

    const parsed = parseNotification(body);
    expect(parsed).not.toBeNull();
    expect(parsed!.message.text).toBe('Привет');
    expect(parsed!.message.fromMe).toBe(false);
    expect(parsed!.message.chatId).toBe('79279791116');
    expect(parsed!.contact.phone).toBe('79279791116');
    expect(parsed!.contact.name).toBe('Николай');
  });

  it('парсит исходящее сообщение как fromMe=true', () => {
    const body: NotificationBody = {
      typeWebhook: 'outgoingMessageReceived',
      idMessage: '456',
      timestamp: 1790332349,
      senderData: { chatId: '196998690', chatName: 'Николай', senderPhoneNumber: 79279791116 },
      messageData: { typeMessage: 'textMessage', textMessageData: { textMessage: 'Роооор' } },
    };

    const parsed = parseNotification(body);
    expect(parsed).not.toBeNull();
    expect(parsed!.message.fromMe).toBe(true);
    expect(parsed!.message.text).toBe('Роооор');
  });

  it('извлекает текст из buttonsMessage', () => {
    const body: NotificationBody = {
      typeWebhook: 'incomingMessageReceived',
      timestamp: 1790332349,
      senderData: { chatId: '272401907', chatName: 'бот' },
      messageData: {
        typeMessage: 'buttonsMessage',
        buttonsMessage: { contentText: 'Выберите инструмент' },
      },
    };

    const parsed = parseNotification(body);
    expect(parsed).not.toBeNull();
    expect(parsed!.message.text).toBe('Выберите инструмент');
    expect(parsed!.message.chatId).toBe('272401907');
  });

  it('возвращает null если нет текста', () => {
    const body: NotificationBody = {
      typeWebhook: 'incomingMessageReceived',
      senderData: { chatId: '79279791116@c.us' },
      messageData: { typeMessage: 'imageMessage' },
    };

    expect(parseNotification(body)).toBeNull();
  });

  it('возвращает null если нет chatId', () => {
    const body: NotificationBody = {
      typeWebhook: 'incomingMessageReceived',
      messageData: { typeMessage: 'textMessage', textMessageData: { textMessage: 'привет' } },
    };

    expect(parseNotification(body)).toBeNull();
  });
});