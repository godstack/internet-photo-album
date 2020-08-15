import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import classNames from 'classnames';
import './UserItem.css';
import { useHttp } from '../../hooks/http.hook';

export const UserItem = ({ user }) => {
  const { user: authUser } = useContext(AuthContext);
  const { request, loading, error, clearError } = useHttp();
  const auth = useContext(AuthContext);

  const handleFollow = async () => {
    const data = await request(
      `/api/user/follow/${user.nickname}`,
      'POST',
      null,
      {
        authorization: `Bearer ${auth.user.token}`
      }
    );

    auth.login({ ...auth.user, following: data.followingAuth });
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
          />
        ) : (
          <div className='user-item__image'>
            <i className='far fa-file-image'></i>
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
