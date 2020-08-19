import React, { useContext, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import classNames from 'classnames';
import { useMessage } from '../../hooks/useMessage';
import './UserItem.css';

export const UserItem = ({ user, request }) => {
  const { login, user: authUser, logout } = useContext(AuthContext);
  const message = useMessage();
  const history = useHistory();

  const handleFollow = async () => {
    const data = await request(
      `/api/user/follow/${user.nickname}`,
      'POST',
      null,
      {
        authorization: `Bearer ${authUser.token}`
      }
    );

    login({ ...authUser, following: data.followingAuth });
  };

  const showFollowButton = () => {
    if (authUser.nickname !== user.nickname) {
      const isFollowing = !!authUser.following.find(
        el => el.nickname === user.nickname
      );

      return (
        <button
          className={classNames(
            'user-item__btn',
            'btn',
            isFollowing ? 'btn-unfollow' : 'btn-follow'
          )}
          onClick={handleFollow}
        >
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      );
    }
  };

  return (
    <div className='user-item'>
      <NavLink to={`/user/${user.nickname}`}>
        {user.profilePhoto ? (
          <img
            className='user-item__image'
            src={`data:image/jpeg;base64,${Buffer.from(
              user.profilePhoto,
              'binary'
            ).toString('base64')}`}
            alt='profile'
          />
        ) : (
          <div className='user-item__image'>
            <i className='far fa-eye-slash'></i>
          </div>
        )}
      </NavLink>
      <NavLink to={`/user/${user.nickname}`}>
        <span className='user-item__nickname'>{user.nickname}</span>
      </NavLink>

      {showFollowButton()}
    </div>
  );
};
