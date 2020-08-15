import { useState, useCallback, useEffect } from 'react';

const storageName = 'userData';

export const useAuth = () => {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);

  const login = useCallback(({ token, userId, nickname, following }) => {
    setUser({ userId, token, nickname, following });

    localStorage.setItem(
      storageName,
      JSON.stringify({ token, userId, nickname, following })
    );
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(storageName);
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName));

    if (data && data.token) {
      login({ ...data });
    }

    setReady(true);
  }, [login]);

  return { login, logout, ready, user };
};
