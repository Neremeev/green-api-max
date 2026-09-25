import type { Contact } from '../../types';
import { PersonIcon, SearchIcon } from '../icons';

interface Props {
  activeChat: Contact | null;
  onSearchOpen: () => void;
}

export function ChatHeader({ activeChat, onSearchOpen }: Props) {
  return (
    <div className="chat-window-header">
      <div className="avatar">
        <PersonIcon size={20} />
      </div>
      <div className="chat-window-title">
        {activeChat?.name ? activeChat.name : `+${activeChat?.phone}`}
      </div>
      <button
        className="icon-btn"
        title="Поиск по сообщениям"
        onClick={onSearchOpen}
        aria-label="Поиск по сообщениям"
      >
        <SearchIcon size={20} />
      </button>
    </div>
  );
}