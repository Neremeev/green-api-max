import type { Contact } from '../types';
import { useMessageSearch } from '../hooks/useMessageSearch';
import { ChatHeader } from './chat/ChatHeader';
import { MessageSearch } from './chat/MessageSearch';
import { MessageList } from './chat/MessageList';
import { Composer } from './chat/Composer';

interface UseChatShape {
  activeChat: Contact | null;
  isConnected: boolean;
  sendMessage: (text: string) => void;
}

interface Props {
  chat: UseChatShape;
}

export function ChatWindow({ chat }: Props) {
  const messages = chat.activeChat?.messages ?? [];

  const search = useMessageSearch({ messages });

  return (
    <div className="chat-window">
      <ChatHeader activeChat={chat.activeChat} onSearchOpen={search.open} />

      {search.isSearchOpen && (
        <MessageSearch
          value={search.query}
          onChange={search.updateQuery}
          total={search.total}
          currentIdx={search.currentIdx}
          onPrev={search.goPrev}
          onNext={search.goNext}
          onClose={search.close}
        />
      )}

      <MessageList
        activeChat={chat.activeChat}
        query={search.query}
        currentIdx={search.currentIdx}
        matchIds={search.matchIds}
        hasQuery={search.hasQuery}
        isSearchOpen={search.isSearchOpen}
      />

      <Composer onSend={chat.sendMessage} />
    </div>
  );
}