import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Credentials } from '../types';

interface Props {
  isOpen: boolean;
  isConnected: boolean;
  onClose: () => void;
  onConnect: (creds: Credentials) => void;
  onDisconnect: () => void;
}

export function CredentialsPanel({ isOpen, isConnected, onClose, onConnect, onDisconnect }: Props) {
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!idInstance.trim() || !apiTokenInstance.trim()) {
      setError('Заполните idInstance и apiTokenInstance');
      return;
    }
    setError(null);
    onConnect({ idInstance: idInstance.trim(), apiTokenInstance: apiTokenInstance.trim() });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{isConnected ? 'Настройки GREEN-API' : 'Вход в GREEN-API'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="field">
            <span>idInstance</span>
            <input
              type="text"
              value={idInstance}
              onChange={(e) => setIdInstance(e.target.value)}
              placeholder="123456789"
              autoComplete="off"
            />
          </label>

          <label className="field">
            <span>apiTokenInstance</span>
            <input
              type="password"
              value={apiTokenInstance}
              onChange={(e) => setApiTokenInstance(e.target.value)}
              placeholder="ваш токен"
              autoComplete="off"
            />
          </label>

          {error && <div className="form-error">{error}</div>}

          <div className="modal-actions">
            {isConnected ? (
              <button type="button" className="btn btn-danger" onClick={onDisconnect}>
                Выйти
              </button>
            ) : (
              <button type="submit" className="btn btn-primary">
                Подключиться
              </button>
            )}
          </div>
        </form>

        <p className="hint">
          Учётные данные из личного кабинета GREEN-API: idInstance и apiTokenInstance.
        </p>
      </div>
    </div>
  );
}