import type { Message } from '../types';
import { highlight } from '../utils/chatUtils';

interface Props {
  message: Message;
  time: string;
  query?: string;
}

export function MessageBubble({ message, time, query = '' }: Props) {
  const cls = [
    message.fromMe ? 'bubble bubble-out' : 'bubble bubble-in',
  ].join(' ').trim();

  const fragments = highlight(message.text, query);

  return (
    <div className={cls} id={`msg-${message.id}`}>
      <div className="bubble-text">
        {fragments
          ? fragments.map((f, i) =>
              f.match ? <mark key={i}>{f.text}</mark> : <span key={i}>{f.text}</span>
            )
          : message.text}
      </div>
      <div className="bubble-meta">
        <span className="bubble-time">{time}</span>
        {message.fromMe && (
          <span className={`bubble-status status-${message.status}`}>
            {message.status === 'pending' && '🕓'}
            {message.status === 'sent' && '✓'}
            {message.status === 'error' && '✗'}
          </span>
        )}
      </div>
    </div>
  );
}