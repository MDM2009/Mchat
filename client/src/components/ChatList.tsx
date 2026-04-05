import { useState, useEffect } from 'react'
import { FiSearch, FiSettings, FiLogOut, FiPlus } from 'react-icons/fi'
import Settings from './Settings'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'
import { chatsAPI, usersAPI, removeToken } from '../services/api'

interface Chat {
  _id: string
  participants: any[]
  lastMessage: string
  lastMessageTime: string
}

interface ChatListProps {
  chats: Chat[]
  selectedChat: string | null
  onSelectChat: (chatId: string) => void
  onLogout: () => void
  onChatsLoad: (chats: Chat[]) => void
}

function ChatList({ chats, selectedChat, onSelectChat, onLogout, onChatsLoad }: ChatListProps) {
  const [search, setSearch] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [showAddChat, setShowAddChat] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { t } = useLanguage()
  const { theme } = useTheme()

  // Load chats on mount
  useEffect(() => {
    loadChats()
  }, [])

  const loadChats = async () => {
    try {
      const result = await chatsAPI.getAll()
      onChatsLoad(result.chats || [])
    } catch (err) {
      console.error('Failed to load chats:', err)
    }
  }

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    try {
      setLoading(true)
      const result = await usersAPI.search(query)
      setSearchResults(result.users || [])
    } catch (err) {
      console.error('Search failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStartChat = async (userId: string) => {
    try {
      const result = await chatsAPI.getChat(userId)
      await loadChats()
      onSelectChat(result.chat._id)
      setShowAddChat(false)
      setSearch('')
      setSearchResults([])
    } catch (err) {
      console.error('Failed to create chat:', err)
    }
  }

  const filtered = chats.filter(chat => {
    const otherUser = chat.participants.find((p: any) => p._id !== localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).id : null)
    const name = otherUser?.nickname || otherUser?.username || 'Chat'
    return name.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <>
      <div className="flex flex-col h-full bg-white dark:bg-dark-card">
        {/* Header */}
        <div className="header p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-telegram-dark dark:text-dark-text">
              {t('chatsTitle')}
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddChat(!showAddChat)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-telegram-blue"
                title="Новый чат"
              >
                <FiPlus size={24} />
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                title={t('settingsTitle')}
              >
                <FiSettings size={24} className="text-telegram-blue" />
              </button>
            </div>
          </div>

          {/* Search or Add Chat */}
          {showAddChat ? (
            <div className="space-y-2">
              <div className="relative">
                <FiSearch
                  className="absolute left-3 top-3 text-telegram-gray dark:text-dark-gray"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Поиск пользователей..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    handleSearch(e.target.value)
                  }}
                  className="input-field w-full pl-10 pr-4 py-2 bg-telegram-light dark:bg-gray-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-telegram-blue"
                  autoFocus
                />
              </div>
              {searchResults.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg max-h-48 overflow-y-auto">
                  {searchResults.map(user => (
                    <button
                      key={user._id}
                      onClick={() => handleStartChat(user._id)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 border-b border-gray-200 dark:border-gray-600 transition"
                    >
                      <p className="font-semibold text-sm dark:text-dark-text">{user.nickname}</p>
                      <p className="text-xs text-gray-500 dark:text-dark-gray">@{user.username}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <FiSearch
                className="absolute left-3 top-3 text-telegram-gray dark:text-dark-gray"
                size={20}
              />
              <input
                type="text"
                placeholder={t('chatsSearch')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field w-full pl-10 pr-4 py-2 bg-telegram-light dark:bg-gray-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-telegram-blue"
              />
            </div>
          )}
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length > 0 ? (
            filtered.map(chat => {
              const otherUser = chat.participants.find(
                (p: any) => p._id !== (JSON.parse(localStorage.getItem('user') || '{}').id)
              )
              const displayName = otherUser?.nickname || otherUser?.username || 'Chat'
              const displayInitial = displayName.charAt(0).toUpperCase()

              return (
                <div
                  key={chat._id}
                  onClick={() => {
                    onSelectChat(chat._id)
                    setShowAddChat(false)
                  }}
                  className={`flex items-center gap-3 p-4 cursor-pointer transition border-l-4 ${
                    selectedChat === chat._id
                      ? 'bg-blue-50 dark:bg-gray-700 border-telegram-blue'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-transparent'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-telegram-blue text-white flex items-center justify-center text-lg font-bold flex-shrink-0">
                    {displayInitial}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-dark-text truncate">
                      {displayName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-dark-gray truncate">
                      {chat.lastMessage || 'No messages yet'}
                    </p>
                  </div>

                  <span className="text-xs text-gray-400 dark:text-dark-gray flex-shrink-0">
                    {new Date(chat.lastMessageTime).toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-telegram-gray dark:text-dark-gray py-12">
              <div className="text-4xl mb-4">💬</div>
              <p className="font-semibold">{showAddChat ? 'Результатов не найдено' : t('chatsEmpty')}</p>
            </div>
          )}
        </div>

        {/* Footer with Logout */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <button
            onClick={() => {
              removeToken()
              localStorage.removeItem('user')
              onLogout()
            }}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            <FiLogOut size={18} />
            {t('settingsLogout')}
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <Settings
          onClose={() => setShowSettings(false)}
          onLogout={onLogout}
        />
      )}
    </>
  )
}

export default ChatList
