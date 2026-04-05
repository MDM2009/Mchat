import { useState } from 'react'
import { FiX, FiMoon, FiGlobe, FiLogOut, FiInfo, FiBell, FiLock } from 'react-icons/fi'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'

interface SettingsProps {
  onClose: () => void
  onLogout: () => void
}

function Settings({ onClose, onLogout }: SettingsProps) {
  const { theme, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const [activeTab, setActiveTab] = useState('general')

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    onLogout()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="card rounded-lg w-full max-w-2xl max-h-screen overflow-hidden flex flex-col">
        {/* Header */}
        <div className="header p-6 flex items-center justify-between border-b">
          <h2 className="text-2xl font-bold">{t('settingsTitle')}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Tabs */}
          <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg p-4 space-y-2">
            {[
              { id: 'general', label: t('settingsTitle'), icon: FiGlobe },
              { id: 'account', label: t('settingsAccount'), icon: FiBell },
              { id: 'privacy', label: t('settingsPrivacy'), icon: FiLock },
              { id: 'about', label: t('settingsAbout'), icon: FiInfo },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeTab === id
                    ? 'bg-telegram-blue text-white'
                    : 'text-gray-700 dark:text-dark-text hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="w-2/3 overflow-y-auto p-6 space-y-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <>
                {/* Theme */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FiMoon size={20} />
                    {t('settingsTheme')}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {['light', 'dark'].map(value => (
                      <button
                        key={value}
                        onClick={() => {
                          if ((value === 'dark' && theme === 'light') || (value === 'light' && theme === 'dark')) {
                            toggleTheme()
                          }
                        }}
                        className={`p-4 rounded-lg border-2 transition font-semibold ${
                          theme === value
                            ? 'border-telegram-blue bg-blue-50 dark:bg-blue-900'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        {value === 'light' ? '☀️' : '🌙'} {t(value === 'light' ? 'settingsLight' : 'settingsDark')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FiGlobe size={20} />
                    {t('settingsLanguage')}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { code: 'ru', label: 'Русский' },
                      { code: 'en', label: 'English' },
                    ].map(({ code, label }) => (
                      <button
                        key={code}
                        onClick={() => setLanguage(code as 'ru' | 'en')}
                        className={`p-4 rounded-lg border-2 transition font-semibold ${
                          language === code
                            ? 'border-telegram-blue bg-blue-50 dark:bg-blue-900'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Account Settings */}
            {activeTab === 'account' && (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-4">{t('settingsAccount')}</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-dark-gray">Никнейм</p>
                      <p className="text-lg font-semibold">{localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).nickname : 'User'}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                      <FiLogOut size={20} />
                      {t('settingsLogout')}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-4">{t('settingsNotifications')}</h3>
                  <div className="space-y-3">
                    {['Звуковые уведомления', 'Всплывающие уведомления', 'Уведомления при упоминании'].map(
                      item => (
                        <label key={item} className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                          <span className="font-medium">{item}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">{t('settingsPrivacy')}</h3>
                  <div className="space-y-3">
                    {['Видеть мой статус', 'Читать квитанции', 'Показывать "печатает"'].map(item => (
                      <label key={item} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                        <span className="font-medium">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* About */}
            {activeTab === 'about' && (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-4">{t('settingsAbout')}</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-dark-gray">Приложение</p>
                      <p className="text-lg font-semibold">Mchat v1.0.0</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-dark-gray">Разработчик</p>
                      <p className="text-lg font-semibold">Daniyar</p>
                    </div>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-dark-gray">
                        Mchat — это современный мессенджер с поддержкой шифрования, темной темы и мультиязычного интерфейса.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
