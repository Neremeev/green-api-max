import type { Credentials, Notification } from '../types';

const API_BASE = 'https://api.green-api.com';

interface SendMessageResponse {
  idMessage?: string;
  invokeStatus?: {
    status?: string;
    description?: string;
  };
}

export class GreenApiClient {
  private readonly idInstance: string;
  private readonly apiTokenInstance: string;

  constructor({ idInstance, apiTokenInstance }: Credentials) {
    this.idInstance = idInstance;
    this.apiTokenInstance = apiTokenInstance;
  }

  async sendMessage(chatId: string, message: string): Promise<string> {
    const url = `${API_BASE}/waInstance${this.idInstance}/sendMessage/${this.apiTokenInstance}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, message }),
    });

    const data = (await res.json()) as SendMessageResponse;

    if (!res.ok || !data.idMessage) {
      throw new Error(data.invokeStatus?.description || `sendMessage failed: ${res.status}`);
    }

    return data.idMessage;
  }

  async receiveNotification(): Promise<Notification | null> {
    const url = `${API_BASE}/waInstance${this.idInstance}/receiveNotification/${this.apiTokenInstance}?receiveTimeout=5`;

    const res = await fetch(url);

    if (res.status === 200) {
      const json = (await res.json()) as Notification | null;
      return json;
    }

    return null;
  }

  async deleteNotification(receiptId: number): Promise<void> {
    const url = `${API_BASE}/waInstance${this.idInstance}/deleteNotification/${this.apiTokenInstance}/${receiptId}`;
    await fetch(url, { method: 'DELETE' });
  }
}