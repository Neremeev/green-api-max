import { describe, expect, it, beforeEach } from 'vitest';
import { useChatStore } from './chatStore';

describe('chatStore', () => {
  beforeEach(() => {
    useChatStore.setState({
      credentials: null,
      contacts: [],
      activePhone: null,
      isConnected: false,
      error: null,
    });
  });

  it('connect подключает и сбрасывает контакты', () => {
    useChatStore.getState().addContact('79270000000');
    useChatStore.getState().connect({ idInstance: '1', apiTokenInstance: 'token' });

    const state = useChatStore.getState();
    expect(state.isConnected).toBe(true);
    expect(state.credentials).toEqual({ idInstance: '1', apiTokenInstance: 'token' });
    expect(state.contacts).toEqual([]);
  });

  it('disconnect отключает', () => {
    useChatStore.getState().connect({ idInstance: '1', apiTokenInstance: 'token' });
    useChatStore.getState().disconnect();

    expect(useChatStore.getState().isConnected).toBe(false);
    expect(useChatStore.getState().credentials).toBeNull();
  });

  it('addContact добавляет контакт и активирует его', () => {
    useChatStore.getState().addContact('79270000000');

    const state = useChatStore.getState();
    expect(state.contacts).toHaveLength(1);
    expect(state.contacts[0].phone).toBe('79270000000');
    expect(state.activePhone).toBe('79270000000');
  });

  it('addContact не дублирует существующий контакт', () => {
    useChatStore.getState().addContact('79270000000');
    useChatStore.getState().addContact('79270000000');

    expect(useChatStore.getState().contacts).toHaveLength(1);
  });

  it('selectChat меняет активный чат', () => {
    useChatStore.getState().addContact('79270000000');
    useChatStore.getState().selectChat('79270000000');

    expect(useChatStore.getState().activePhone).toBe('79270000000');
  });

  it('setContacts и setError обновляют состояние', () => {
    useChatStore.getState().setError('ошибка');
    expect(useChatStore.getState().error).toBe('ошибка');

    useChatStore.getState().setContacts([{ phone: '1', messages: [] }]);
    expect(useChatStore.getState().contacts).toHaveLength(1);
  });
});