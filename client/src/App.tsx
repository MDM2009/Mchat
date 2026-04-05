import { useState, useEffect } from 'react'
import ChatList from './components/ChatList'
import MessageWindow from './components/MessageWindow'
import Auth from './components/Auth'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { getToken } from './services/api'

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken())
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [chats, setChats] = useState<any[]>([])

  useEffect(() => {
    // Check if token exists on mount
    if (getToken()) {
      setIsAuthenticated(true)
    }
  }, [])

  if (!isAuthenticated) {
    return <Auth onAuthenticate={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="flex h-screen bg-white dark:bg-dark-bg">
      {/* Левая панель - список чатов */}
      <div className="w-1/3 sidebar">
        <ChatList 
          chats={chats} 
          onSelectChat={setSelectedChat}
          selectedChat={selectedChat}
          onLogout={() => setIsAuthenticated(false)}
          onChatsLoad={setChats}
        />
      </div>

      {/* Правая панель - окно сообщений */}
      <div className="w-2/3 bg-telegram-light dark:bg-dark-bg flex flex-col">
        {selectedChat ? (
          <MessageWindow chatId={selectedChat} />
        ) : (
          <div className="flex items-center justify-center h-full text-telegram-gray dark:text-dark-gray text-xl">
            Выберите чат для начала переписки
          </div>
        )}
      </div>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
