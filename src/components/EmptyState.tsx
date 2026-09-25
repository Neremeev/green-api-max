interface Props {
  onNewChat: () => void;
  hint?: string;
}

export function EmptyState({ onNewChat, hint }: Props) {
  return (
    <div className="empty-state">
      <div className="empty-icon">💬</div>
      <h2 className="empty-title">Мессенджер</h2>
      <p className="empty-hint">
        {hint ?? 'Создайте чат, чтобы начать общаться'}
      </p>
      <button className="btn btn-primary" onClick={onNewChat}>
        Начать чат
      </button>
    </div>
  );
}