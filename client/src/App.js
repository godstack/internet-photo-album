import React from 'react';
import './index.css';
import 'materialize-css';
import { BrowserRouter as Router } from 'react-router-dom';
import { Header } from './components/Header/Header';

import { useRoutes } from './routes';
import { useAuth } from './hooks/auth.hook';
import { AuthContext } from './context/AuthContext';
import { Loader } from './components/Loader/Loader';

function App() {
  const { login, logout, token, userId, ready, nickname } = useAuth();
  const isAuthenticated = !!token;

  const routes = useRoutes(isAuthenticated, nickname);

  if (!ready) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider
      value={{ login, logout, token, userId, isAuthenticated, nickname }}
    >
      <Router>
        <Header />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
