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
      <NavLink to='/users' className='nav__item'>
        <i className='fas fa-users'></i>
      </NavLink>
      <div className='nav__item topmenu'>
        <i className='fas fa-user-circle'></i>
        <div className='submenu'>
          <NavLink to={`/user/${auth.user.nickname}`} className='submenu__item'>
            <i className='far fa-id-card'></i> <span>Profile</span>
          </NavLink>
          <NavLink to='/addpost' className='submenu__item'>
            <i className='far fa-plus-square'></i>
            <span>Add Photo</span>
          </NavLink>
          <NavLink to='/settings' className='submenu__item'>
            <i className='fas fa-cog'></i>
            <span>Settings</span>
          </NavLink>
          <a
            href='/'
            onClick={logoutHandler}
            className='submenu__item logout__item'
          >
            <i className='fas fa-sign-out-alt'></i> <span>Logout</span>
          </a>
        </div>
      </div>
      <NavLink to='/info' className='nav__item'>
        <i className='fas fa-info-circle'></i>
      </NavLink>
    </nav>
  );
};
