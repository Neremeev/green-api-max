import type { Contact, Message } from '../types';

export function normalizePhone(raw: string): string {
  let phone = raw.replace(/\D/g, '');

  if (phone.startsWith('8') && phone.length === 11) {
    phone = '7' + phone.slice(1);
  }
  if (phone.length === 10) {
    phone = '7' + phone;
  }

  return phone;
}

export function toChatId(phone: string): string {
  return `${phone}@c.us`;
}

export function formatPhoneMask(value: string): string {
  const digits = value.replace(/\D/g, '');

  let body = digits.startsWith('7') || digits.startsWith('8') ? digits.slice(1) : digits;
  if (body.length > 10) body = body.slice(0, 10);

  const parts: string[] = [];
  if (body.length > 0) parts.push(body.slice(0, 3));
  if (body.length > 3) parts.push(body.slice(3, 6));
  if (body.length > 6) parts.push(body.slice(6, 8));
  if (body.length > 8) parts.push(body.slice(8, 10));

  let result = '+7';
  if (parts[0]) result += ` (${parts[0]}`;
  if (parts[1]) result += `) ${parts[1]}`;
  if (parts[2]) result += `-${parts[2]}`;
  if (parts[3]) result += `-${parts[3]}`;

  return result;
}

export function formatTime(timestamp: number): string {
  const d = new Date(timestamp);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

export function highlight(text: string, query: string): { text: string; match: boolean }[] | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;

  const lower = text.toLowerCase();
  const result: { text: string; match: boolean }[] = [];
  let i = 0;

  while (i < text.length) {
    const idx = lower.indexOf(q, i);
    if (idx === -1) {
      result.push({ text: text.slice(i), match: false });
      break;
    }
    if (idx > i) {
      result.push({ text: text.slice(i, idx), match: false });
    }
    result.push({ text: text.slice(idx, idx + q.length), match: true });
    i = idx + q.length;
  }

  return result.length > 0 ? result : null;
}

export function upsertMessage(contacts: Contact[], chatId: string, msg: Message): Contact[] {
  return contacts.map((c) => {
    if (c.phone !== chatId) return c;

    const existingIndex = c.messages.findIndex((m) => m.id === msg.id);

    if (existingIndex >= 0) {
      const next = [...c.messages];
      next[existingIndex] = msg;
      return { ...c, messages: next };
    }

    return { ...c, messages: [...c.messages, msg] };
  });
}