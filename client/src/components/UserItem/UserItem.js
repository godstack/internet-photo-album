import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import classNames from 'classnames';

import './UserItem.css';

export const UserItem = ({ user, request }) => {
  const { login, user: authUser } = useContext(AuthContext);

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
      const isFollowing = !!authUser.following.find(el => el === user._id);

      return (
        <button
          className={classNames(
            'btn',
            'user-item__btn',
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
    <section className='user-item'>
      <NavLink to={`/user/${user.nickname}`}>
        <section className='user-item__wrapper'>
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
            <i className='far fa-eye-slash'></i>
          )}
        </section>
      </NavLink>
      <NavLink to={`/user/${user.nickname}`}>
        <span className='user-item__nickname'>{user.nickname}</span>
      </NavLink>

      {showFollowButton()}
    </section>
  );
};
