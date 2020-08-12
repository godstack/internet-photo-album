import { useState, useCallback, useEffect } from 'react';

const storageName = 'userData';

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState(null);
  const [nickname, setNickname] = useState(null);

  const login = useCallback((jwtToken, id, name) => {
    setToken(jwtToken);
    setUserId(id);
    setNickname(name);

    localStorage.setItem(
      storageName,
      JSON.stringify({ userId: id, token: jwtToken, nickname: name })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setNickname(null);
    localStorage.removeItem(storageName);
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName));

    if (data && data.token) {
      login(data.token, data.userId, data.nickname);
    }

    setReady(true);
  }, [login]);

  return { login, logout, token, userId, ready, nickname };
};
