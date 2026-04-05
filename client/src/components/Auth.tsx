import { useState } from 'react'
import { FiMail, FiLock, FiUser } from 'react-icons/fi'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import { authAPI, setToken } from '../services/api'

interface AuthProps {
  onAuthenticate: () => void
}

function Auth({ onAuthenticate }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let result

      if (isLogin) {
        result = await authAPI.login(username, password)
      } else {
        result = await authAPI.register(username, email, password, nickname)
      }

      // Save token and user info
      setToken(result.token)
      localStorage.setItem('user', JSON.stringify(result.user))

      onAuthenticate()
    } catch (err: any) {
      setError(err.message || 'Ошибка авторизации')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`flex items-center justify-center h-screen bg-gradient-to-br ${
      theme === 'dark'
        ? 'from-gray-900 to-gray-800'
        : 'from-blue-50 to-indigo-100'
    }`}>
      <div className={`card p-8 rounded-2xl shadow-2xl w-full max-w-md ${
        theme === 'dark' ? 'bg-dark-card' : 'bg-white'
      }`}>
        {/* Header with Theme Toggle */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-telegram-blue">Mchat</h1>
          <div className="flex gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              title="Изменить тему"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'ru' | 'en')}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-sm font-medium"
            >
              <option value="ru">🇷🇺 RU</option>
              <option value="en">🇬🇧 EN</option>
            </select>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="relative">
            <FiMail className="absolute left-3 top-3 text-telegram-gray dark:text-dark-gray" size={20} />
            <input
              type="text"
              placeholder={t('authUsername')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-telegram-blue"
              required
              disabled={loading}
            />
          </div>

          {/* Email (только для регистрации) */}
          {!isLogin && (
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-telegram-gray dark:text-dark-gray" size={20} />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-telegram-blue"
                required
                disabled={loading}
              />
            </div>
          )}

          {/* Password */}
          <div className="relative">
            <FiLock className="absolute left-3 top-3 text-telegram-gray dark:text-dark-gray" size={20} />
            <input
              type="password"
              placeholder={t('authPassword')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-telegram-blue"
              required
              disabled={loading}
            />
          </div>

          {/* Nickname (только для регистрации) */}
          {!isLogin && (
            <div className="relative">
              <FiUser className="absolute left-3 top-3 text-telegram-gray dark:text-dark-gray" size={20} />
              <input
                type="text"
                placeholder={t('authNickname')}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="input-field w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-telegram-blue"
                required
                disabled={loading}
              />
            </div>
          )}

          {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-telegram-blue hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-semibold transition duration-200 transform hover:scale-105 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Загрузка...' : (isLogin ? t('authLogin') : t('authRegister'))}
          </button>
        </form>

        {/* Toggle Auth Mode */}
        <div className="mt-6 text-center">
          <p className={`text-sm ${theme === 'dark' ? 'text-dark-gray' : 'text-gray-600'}`}>
            {isLogin ? t('authNoAccount') : t('authHaveAccount')}{' '}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
              disabled={loading}
              className="text-telegram-blue font-semibold hover:underline disabled:opacity-50"
            >
              {isLogin ? t('authCreateAccount') : t('authSignIn')}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Auth
