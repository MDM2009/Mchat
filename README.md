# Mchat - Telegram Clone

Полнофункциональный клон Telegram с использованием React, Node.js, Socket.io и MongoDB.

## 📋 Структура проекта

```
Mchat/
├── client/          # React + TypeScript + Tailwind CSS
├── server/          # Node.js + Express + Socket.io
└── package.json     # Корневой файл для управления workspaces
```

## 🚀 Быстрый старт

### Предварительные требования
- Node.js 16+ и npm
- Git (опционально)

### Установка зависимостей

```bash
# В корневой папке проекта
npm install
```

Это установит зависимости для обеих частей (client и server) благодаря workspaces.

### Запуск проекта

**Вариант 1: Запуск обеих частей одновременно**

```bash
npm start
```

Это запустит:
- **Client** на http://localhost:3000
- **Server** на http://localhost:5000

**Вариант 2: Запуск отдельно**

```bash
# Только frontend
npm run dev:client

# Только backend (в другом терминале)
npm run dev:server
```

## 🎨 Шаг 1: Структура проекта ✅

- ✅ Монорепозиторий с папками client и server
- ✅ package.json для обеих частей
- ✅ Tailwind CSS конфиг с цветами Telegram
- ✅ TypeScript конфиги
- ✅ Базовые компоненты React

## 📋 Следующие шаги

### Шаг 2: Дизайн (Frontend UI)
- Детально стилизовать компоненты
- Добавить анимации
- Улучшить UX

### Шаг 3: Сервер и База (Backend & DB)
- Подключить MongoDB Atlas
- Реализовать регистрацию и логин
- JWT авторизация

### Шаг 4: WebSockets (Реальное время)
- Реализовать отправку сообщений через Socket.io
- Синхронизация между клиентами в реальном времени

### Шаг 5: Безопасность (Encryption)
- Добавить шифрование сообщений (crypto-js)
- End-to-End Encryption

## 📚 Полезные команды

```bash
# Сборка проекта
npm run build

# Просмотр структуры (из корня)
ls -la
cd client && ls -la
cd ../server && ls -la
```

## 🔐 Переменные окружения

Отредактируйте `server/.env`:

```
PORT=5000
MONGODB_URI=ваш_mongodb_uri
JWT_SECRET=ваш_секретный_ключ
NODE_ENV=development
```

## 🎯 Цветовая палитра Telegram

- Основной синий: `#2481cc`
- Фон чата: `#e7ebf0`
- Темный фон: `#1f2937`
- Серый: `#8a8a8a`

## 💡 Технологический стек

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS
- Socket.io Client
- Crypto-js

**Backend:**
- Node.js
- Express
- Socket.io
- MongoDB + Mongoose
- JWT
- Bcryptjs

---

**Happy coding! 🚀**
