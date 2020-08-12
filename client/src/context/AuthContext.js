const { createContext } = require('react');

function noop() {}

export const AuthContext = createContext({
  token: null,
  userId: null,
  nickname: null,
  login: noop,
  logout: noop,
  isAuthenticated: false
});
