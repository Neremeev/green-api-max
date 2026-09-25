import { useState } from 'react';
import type { FormEvent } from 'react';

interface Props {
  onSend: (text: string) => void;
}

export function Composer({ onSend }: Props) {
  const [text, setText] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText('');
  };

  return (
    <form className="composer" onSubmit={handleSubmit}>
      <input
        className="composer-input"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Введите сообщение"
      />
      <button type="submit" className="btn btn-primary" disabled={!text.trim()}>
        Отправить
      </button>
    </form>
  );
}