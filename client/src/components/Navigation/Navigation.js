import React, { useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Navigation.css';

export const Navigation = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();

  const logoutHandler = event => {
    event.preventDefault();
    auth.logout();
    history.push('/login');
  };

  return (
    <nav className='nav'>
      <NavLink to='/' className='nav__item'>
        <i className='fas fa-home'></i> Main
      </NavLink>
      <NavLink to='/' className='nav__item'>
        <i className='fas fa-user-circle'></i> Profile
      </NavLink>
      <NavLink to='/add' className='nav__item'>
        <i className='far fa-plus-square'></i> Add Photo
      </NavLink>
      <a className='nav__item' href='/' onClick={logoutHandler}>
        <i className='fas fa-sign-out-alt'></i> Logout
      </a>
    </nav>
  );
};
