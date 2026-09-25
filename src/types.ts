export interface Credentials {
  idInstance: string;
  apiTokenInstance: string;
}

export interface Message {
  id: string;
  chatId: string;
  text: string;
  fromMe: boolean;
  timestamp: number;
  status: 'pending' | 'sent' | 'error';
}

export interface Contact {
  phone: string;
  name?: string;
  messages: Message[];
}

export interface NotificationBody {
  typeWebhook: string;
  idMessage?: string;
  messageData?: {
    typeMessage: string;
    textMessageData?: { textMessage?: string };
    extendedTextMessageData?: { text?: string };
    buttonsMessage?: { contentText?: string };
  };
  timestamp?: number;
  senderData?: {
    chatId?: string;
    chatName?: string;
    senderPhoneNumber?: number;
  };
}

export interface Notification {
  receiptId: number;
  body: NotificationBody;
}