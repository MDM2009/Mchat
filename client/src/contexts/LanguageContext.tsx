import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

export type Language = 'ru' | 'en'

export const translations = {
  ru: {
    // Auth
    authTitle: 'Mchat',
    authLoginBtn: 'Вход',
    authRegisterBtn: 'Регистрация',
    authLogin: 'Вход',
    authRegister: 'Регистрация',
    authUsername: 'Логин',
    authPassword: 'Пароль',
    authNickname: 'Никнейм',
    authNoAccount: 'Нет аккаунта?',
    authCreateAccount: 'Создать аккаунт',
    authHaveAccount: 'Уже есть аккаунт?',
    authSignIn: 'Войти',

    // Chat
    chatsTitle: 'Чаты',
    chatsSearch: 'Поиск чатов...',
    chatsEmpty: 'Чаты не найдены',
    chatsOnline: 'Онлайн',
    chatsStartChat: 'Выберите чат для начала переписки',

    // Input
    inputPlaceholder: 'Начните писать...',

    // Settings
    settingsTitle: 'Настройки',
    settingsTheme: 'Тема',
    settingsLanguage: 'Язык',
    settingsLight: 'Светлая',
    settingsDark: 'Темная',
    settingsAccount: 'Аккаунт',
    settingsLogout: 'Выход',
    settingsPrivacy: 'Приватность',
    settingsNotifications: 'Уведомления',
    settingsAbout: 'О приложении',

    // Messages
    todayDate: 'Сегодня',
    yesterdayDate: 'Вчера',
  },
  en: {
    // Auth
    authTitle: 'Mchat',
    authLoginBtn: 'Login',
    authRegisterBtn: 'Register',
    authLogin: 'Login',
    authRegister: 'Register',
    authUsername: 'Username',
    authPassword: 'Password',
    authNickname: 'Nickname',
    authNoAccount: "Don't have an account?",
    authCreateAccount: 'Create account',
    authHaveAccount: 'Already have an account?',
    authSignIn: 'Sign In',

    // Chat
    chatsTitle: 'Chats',
    chatsSearch: 'Search chats...',
    chatsEmpty: 'Chats not found',
    chatsOnline: 'Online',
    chatsStartChat: 'Select a chat to start chatting',

    // Input
    inputPlaceholder: 'Start typing...',

    // Settings
    settingsTitle: 'Settings',
    settingsTheme: 'Theme',
    settingsLanguage: 'Language',
    settingsLight: 'Light',
    settingsDark: 'Dark',
    settingsAccount: 'Account',
    settingsLogout: 'Logout',
    settingsPrivacy: 'Privacy',
    settingsNotifications: 'Notifications',
    settingsAbout: 'About',

    // Messages
    todayDate: 'Today',
    yesterdayDate: 'Yesterday',
  },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: keyof typeof translations.ru) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language')
    return (saved as Language) || 'ru'
  })

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
  }

  const t = (key: keyof typeof translations.ru): string => {
    return translations[language][key as keyof typeof translations['ru']]
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
