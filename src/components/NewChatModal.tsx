import { useState } from 'react';
import type { FormEvent } from 'react';
import { normalizePhone, formatPhoneMask } from '../utils/chatUtils';

interface Props {
  onClose: () => void;
  onCreate: (phone: string) => void;
}

export function NewChatModal({ onClose, onCreate }: Props) {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const normalized = normalizePhone(phone);

    if (normalized.length !== 11) {
      setError('Введите номер телефона в формате 7XXXXXXXXXX');
      return;
    }

    setError(null);
    onCreate(normalized);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Новый чат</h2>
          <button className="modal-close" onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="field">
            <span>Номер телефона получателя</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(formatPhoneMask(e.target.value))}
              placeholder="+7 (900) 123-45-67"
              autoComplete="off"
              autoFocus
            />
          </label>

          {error && <div className="form-error">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              Создать чат
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}