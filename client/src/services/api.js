const API_BASE = 'http://localhost:5000/api'

export const getToken = () => localStorage.getItem('token')
export const setToken = token => localStorage.setItem('token', token)
export const removeToken = () => localStorage.removeItem('token')

const request = async (method, endpoint, data = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
  }

  if (data) {
    options.body = JSON.stringify(data)
  }

  const response = await fetch(`${API_BASE}${endpoint}`, options)
  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'API Error')
  }

  return result
}

// Auth API
export const authAPI = {
  register: (username, email, password, nickname) =>
    request('POST', '/auth/register', {
      username,
      email,
      password,
      nickname,
    }),

  login: (username, password) =>
    request('POST', '/auth/login', { username, password }),

  me: () => request('GET', '/auth/me'),

  logout: () => request('POST', '/auth/logout'),
}

// Users API
export const usersAPI = {
  search: query =>
    request('GET', `/users/search?query=${encodeURIComponent(query)}`),

  getFriends: () => request('GET', '/users/friends'),

  addFriend: userId => request('POST', `/users/friends/add/${userId}`),

  removeFriend: userId =>
    request('POST', `/users/friends/remove/${userId}`),
}

// Chats API
export const chatsAPI = {
  getAll: () => request('GET', '/chats'),

  getChat: userId => request('POST', `/chats/with/${userId}`),

  getMessages: chatId => request('GET', `/chats/${chatId}/messages`),

  sendMessage: (chatId, text, encrypted = false) =>
    request('POST', `/chats/${chatId}/messages`, {
      text,
      encrypted,
    }),
}

export default {
  authAPI,
  usersAPI,
  chatsAPI,
}
