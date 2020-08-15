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
        <i className='fas fa-home'></i>
      </NavLink>
      <div className='nav__item topmenu'>
        <i className='fas fa-user-circle'></i>
        <div className='submenu'>
          <NavLink to={`/user/${auth.user.nickname}`} className='submenu__item'>
            <i className='far fa-id-card'></i> Profile
          </NavLink>
          <NavLink to='/addpost' className='submenu__item'>
            <i className='far fa-plus-square'></i> Add Photo
          </NavLink>
          <NavLink to='/settings' className='submenu__item'>
            <i className='fas fa-cog'></i> Settings
          </NavLink>
          <NavLink
            to='/'
            onClick={logoutHandler}
            className='submenu__item logout__item'
          >
            <i className='fas fa-sign-out-alt'></i> Logout
          </NavLink>
        </div>
      </div>
    </nav>
  );
};
