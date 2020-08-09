import React, { useContext } from 'react';
import { Navigation } from '../Navigation/Navigation';

import './Header.css';
import { AuthContext } from '../../context/AuthContext';

export const Header = () => {
  const auth = useContext(AuthContext);

  return (
    <header className='App-header'>
      <div className='header__section'>
        <div className='header__item headerlogo'>Internet Photo Album</div>
      </div>
      {auth.isAuthenticated && <Navigation />}
    </header>
  );
};
