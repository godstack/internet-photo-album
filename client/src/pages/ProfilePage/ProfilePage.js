import React, { useEffect, useContext, useState, useCallback } from 'react';
import { useHttp } from '../../hooks/http.hook';
import { Loader } from '../../components/Loader/Loader';
import { AuthContext } from '../../context/AuthContext';
import { useMessage } from '../../hooks/useMessage';
import classNames from 'classnames';

import { Post } from '../../components/Post/Post';
import { useParams, useHistory, NavLink } from 'react-router-dom';

import './ProfilePage.css';

export const ProfilePage = props => {
  const [posts, setPosts] = useState(null);
  const [user, setUser] = useState(null);

  const { nickname } = useParams();

  const message = useMessage();
  const history = useHistory();
  const { request, error, clearError, loading } = useHttp();

  const auth = useContext(AuthContext);

  const handleFollow = async () => {
    const data = await request(`/api/user/follow/${nickname}`, 'POST', null, {
      authorization: `Bearer ${auth.user.token}`
    });

    setUser({ ...user, followers: data.followersAim });
    auth.login({ ...auth.user, following: data.followingAuth });
  };

  const showFollowButton = () => {
    if (auth.user.nickname !== nickname) {
      const isFollowing = !!user.followers.find(
        el => el.nickname === auth.user.nickname
      );

      return (
        <button
          className={classNames(
            'profile-info__follow-btn',
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

  const fetchInfo = useCallback(async () => {
    const data = await request(`/api/user/profile/${nickname}`, 'GET', null, {
      authorization: `Bearer ${auth.user.token}`
    });

    if (data?.user?.profilePhoto) {
      data.user.profilePhoto = Buffer.from(
        data.user.profilePhoto,
        'binary'
      ).toString('base64');
    }

    setPosts(data.posts);
    setUser(data.user);
  }, [auth.user.token, nickname, request]);

  useEffect(() => {
    message(error);

    if (error?.toLowerCase() === 'no authorization') {
      auth.logout();
      history.push('/login');
    }

    clearError();
  }, [message, error, clearError, auth, history]);

  useEffect(() => {
    fetchInfo();
  }, [fetchInfo]);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <h2 className='profile-no-user'>Such user does not exist</h2>;
  }

  return (
    <div className='profile-page'>
      <header className='profile-page__header'>
        <div className='profile-image-wrapper'>
          {user.profilePhoto ? (
            <img
              className='profile-image'
              src={`data:image/jpeg;base64,${user.profilePhoto}`}
              alt='profile'
            />
          ) : (
            <p>No profile photo</p>
          )}
        </div>

        <section className='profile-info'>
          <div className='profile-info__wrapper-1'>
            <h2 className='profile-info__nickname'>{user?.nickname}</h2>
            {showFollowButton()}
          </div>
          <ul className='profile-info__amount'>
            <li>{posts?.length} posts</li>
            <li>
              <NavLink
                to={`/user/${nickname}/followers`}
                style={{ color: 'black' }}
              >
                {user?.followers?.length} followers
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/user/${nickname}/following`}
                style={{ color: 'black' }}
              >
                {user?.following?.length} following
              </NavLink>
            </li>
          </ul>
        </section>
      </header>

      <div className='profile-posts'>
        {posts.map(post => (
          <Post post={post} key={post._id} />
        ))}
      </div>
    </div>
  );
};
