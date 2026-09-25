import { useState } from 'react';
import { useChat } from './hooks/useChat';
import { CredentialsPanel } from './components/CredentialsPanel';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { EmptyState } from './components/EmptyState';
import { NewChatModal } from './components/NewChatModal';
import type { Credentials } from './types';

export default function App() {
  const chat = useChat();
  const [isAuthVisible, setIsAuthVisible] = useState(!chat.isConnected);
  const [isNewChatVisible, setIsNewChatVisible] = useState(false);

  // Если не подключены — "новый чат" открывает панель учётных данных
  const handleNewChat = () => {
    if (!chat.isConnected) {
      setIsAuthVisible(true);
      return;
    }
    setIsNewChatVisible(true);
  };

  return (
    <div className="app">
      <Sidebar chat={chat} onNewChat={handleNewChat} />

      <main className="chat-area">
        {chat.isConnected && !chat.activeChat ? (
          <EmptyState onNewChat={handleNewChat} />
        ) : chat.isConnected && chat.activeChat ? (
          <ChatWindow chat={chat} />
        ) : (
          <EmptyState
            onNewChat={handleNewChat}
            hint="Введите учётные данные GREEN-API, чтобы начать работу"
          />
        )}
      </main>

      {isAuthVisible && (
        <CredentialsPanel
          isOpen={isAuthVisible}
          isConnected={chat.isConnected}
          onClose={() => setIsAuthVisible(false)}
          onConnect={(creds: Credentials) => {
            chat.connect(creds);
            setIsAuthVisible(false);
            setIsNewChatVisible(true);
          }}
          onDisconnect={() => {
            chat.disconnect();
            setIsAuthVisible(false);
          }}
        />
      )}

      {isNewChatVisible && (
        <NewChatModal
          onClose={() => setIsNewChatVisible(false)}
          onCreate={(phone) => chat.addContact(phone)}
        />
      )}
    </div>
  );
}