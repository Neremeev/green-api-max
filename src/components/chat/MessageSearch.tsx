import { SearchIcon, ArrowUpIcon, ArrowDownIcon, CloseIcon } from '../icons';

interface Props {
  value: string;
  onChange: (value: string) => void;
  total: number;
  currentIdx: number;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}

export function MessageSearch({
  value,
  onChange,
  total,
  currentIdx,
  onPrev,
  onNext,
  onClose,
}: Props) {
  const hasQuery = value.trim().length > 0;

  return (
    <div className="msg-search">
      <div className="msg-search-box">
        <SearchIcon className="msg-search-icon" size={17} />
        <input
          className="msg-search-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Поиск по сообщениям"
          autoFocus
        />
      </div>

      {hasQuery && (
        <span className="msg-search-count">
          {total > 0 ? `${currentIdx + 1} / ${total}` : '0 / 0'}
        </span>
      )}

      <div className="msg-search-nav">
        <button className="search-nav" onClick={onPrev} disabled={total === 0} aria-label="Назад">
          <ArrowUpIcon size={18} />
        </button>
        <button className="search-nav" onClick={onNext} disabled={total === 0} aria-label="Вперёд">
          <ArrowDownIcon size={18} />
        </button>
        <button className="search-nav" onClick={onClose} aria-label="Закрыть поиск">
          <CloseIcon size={18} />
        </button>
      </div>
    </div>
  );
}