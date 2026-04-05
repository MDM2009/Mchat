import { useState, useRef, useEffect } from 'react'
import { FiPhone, FiVideo, FiMoreVertical, FiSend, FiPlus } from 'react-icons/fi'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'
import { chatsAPI } from '../services/api'
import { io, Socket } from 'socket.io-client'

interface Message {
  _id: string
  senderId: { _id: string; username: string; nickname: string }
  text: string
  createdAt: string
  encrypted?: boolean
}

interface MessageWindowProps {
  chatId: string
}

function MessageWindow({ chatId }: MessageWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(true)
  const [socket, setSocket] = useState<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [otherUser, setOtherUser] = useState<any>(null)
  const { t } = useLanguage()
  const { theme } = useTheme()

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

  // Initialize Socket.io
  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })

    newSocket.on('connect', () => {
      console.log('Connected to server')
      if (currentUser.id) {
        newSocket.emit('user_online', currentUser.id)
      }
    })

    newSocket.on('receive_message', (data: any) => {
      if (data.chatId === chatId) {
        setMessages(prev => [...prev, data.message])
      }
    })

    setSocket(newSocket)

    return () => {
      if (currentUser.id) {
        newSocket.emit('user_offline', currentUser.id)
      }
      newSocket.close()
    }
  }, [chatId, currentUser.id])

  // Load messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true)
        const result = await chatsAPI.getMessages(chatId)
        setMessages(result.messages || [])

        // Extract other user info from messages or chat
        if (result.messages && result.messages.length > 0) {
          const message = result.messages[0]
          const sender = message.senderId
          if (sender._id !== currentUser.id) {
            setOtherUser(sender)
          }
        }
      } catch (err) {
        console.error('Failed to load messages:', err)
      } finally {
        setLoading(false)
      }
    }

    loadMessages()
  }, [chatId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim() || !socket) return

    try {
      // Send via Socket.io
      socket.emit('send_message', {
        chatId,
        text: inputValue,
        userId: currentUser.id,
        username: currentUser.username,
        encrypted: false,
      })

      // Also save to DB
      await chatsAPI.sendMessage(chatId, inputValue, false)
      setInputValue('')
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const groupedMessages = messages.reduce((acc, msg) => {
    const date = new Date(msg.createdAt).toLocaleDateString('ru-RU')
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(msg)
    return acc
  }, {} as Record<string, Message[]>)

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className={`header p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between ${
        theme === 'dark' ? 'bg-dark-card' : 'bg-white'
      }`}>
        <div>
          <h2 className="text-xl font-bold text-telegram-dark dark:text-dark-text">
            {otherUser?.nickname || 'Chat'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-dark-gray">Онлайн</p>
        </div>
        <div className="flex gap-3">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-telegram-blue">
            <FiPhone size={24} />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-telegram-blue">
            <FiVideo size={24} />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-telegram-blue">
            <FiMoreVertical size={24} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto p-6 space-y-4 ${
        theme === 'dark' ? 'bg-dark-bg' : 'bg-telegram-light'
      }`}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-telegram-gray dark:text-dark-gray">Загрузка сообщений...</p>
          </div>
        ) : (
          <>
            {Object.entries(groupedMessages).map(([date, msgs]) => (
              <div key={date}>
                <div className="flex items-center justify-center mb-4">
                  <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} px-3 py-1 rounded-full text-xs ${
                    theme === 'dark' ? 'text-dark-gray' : 'text-gray-600'
                  }`}>
                    {date}
                  </div>
                </div>

                {msgs.map(msg => (
                  <div
                    key={msg._id}
                    className={`flex mb-3 ${msg.senderId._id === currentUser.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs px-4 py-2 rounded-message ${
                      msg.senderId._id === currentUser.id
                        ? 'message-bubble-own'
                        : 'message-bubble-other'
                    }`}>
                      <p className="text-sm break-words">{msg.text}</p>
                      <p className={`text-xs mt-1 ${
                        msg.senderId._id === currentUser.id ? 'text-blue-100' : theme === 'dark' ? 'text-dark-gray' : 'text-gray-500'
                      }`}>
                        {new Date(msg.createdAt).toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className={`border-t ${
        theme === 'dark' 
          ? 'bg-dark-card border-gray-700' 
          : 'bg-white border-gray-200'
      } p-4`}>
        <div className="flex gap-3">
          <button className="flex-shrink-0 text-telegram-blue hover:text-blue-700 transition p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <FiPlus size={24} />
          </button>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('inputPlaceholder')}
            rows={1}
            className={`input-field flex-1 border rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-telegram-blue ${
              theme === 'dark'
                ? 'bg-gray-700 text-dark-text border-gray-600'
                : 'bg-white text-gray-900 border-gray-300'
            }`}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="flex-shrink-0 bg-telegram-blue text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <FiSend size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default MessageWindow
