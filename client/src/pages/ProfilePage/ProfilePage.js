import React, { useEffect, useContext, useState, useCallback } from 'react';
import { useHttp } from '../../hooks/http.hook';
import { Loader } from '../../components/Loader/Loader';
import { AuthContext } from '../../context/AuthContext';
import { useMessage } from '../../hooks/useMessage';
import classNames from 'classnames';

import { Post } from '../../components/Post/Post';
import { useParams, useHistory, NavLink } from 'react-router-dom';

import './ProfilePage.css';
import { Pagination } from '../../components/Pagination/Pagination';
import { ProfileImage } from '../../components/ProfileImage/ProfileImage';

export const ProfilePage = props => {
  const [posts, setPosts] = useState(null);
  const [user, setUser] = useState(null);
  const [postsCount, setPostsCount] = useState(null);
  const [page, setPage] = useState(1);
  const [pagesCount, setPagesCount] = useState(1);

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
      const isFollowing = !!user.followers.find(el => el._id === auth.user._id);

      return (
        <button
          className={classNames(
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

  const fetchInfo = useCallback(
    async currentPage => {
      const data = await request(
        `/api/user/profile/${nickname}?page=${currentPage}`,
        'GET',
        null,
        {
          authorization: `Bearer ${auth.user.token}`
        }
      );

      if (data?.user?.profilePhoto) {
        data.user.profilePhoto = Buffer.from(
          data.user.profilePhoto,
          'binary'
        ).toString('base64');
      }

      setPosts(data.posts);

      setUser(data.user);
      setPagesCount(data.pagesCount);
      setPostsCount(data.postsCount);
    },
    [auth.user.token, nickname, request]
  );

  useEffect(() => {
    message(error);

    if (error?.toLowerCase() === 'no authorization') {
      auth.logout();
      history.push('/login');
    }

    clearError();
  }, [message, error, clearError, auth, history]);

  useEffect(() => {
    fetchInfo(page);
  }, [fetchInfo, page]);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <h2 className='profile-no-user'>Such user does not exist</h2>;
  }

  return (
    <div className='profile-page'>
      <header className='profile-page__header'>
        <div className='profile-info__img'>
          <ProfileImage photo={user.profilePhoto} />
        </div>
        <h2 className='profile-info__nickname'>{user?.nickname}</h2>
        <div className='profile-info__follow-btn'>{showFollowButton()}</div>

        <div className='profile-info__posts'>{postsCount} posts</div>
        <div className='profile-info__followers '>
          <NavLink
            to={`/user/${user?.nickname}/followers`}
            style={{ color: 'black' }}
          >
            {user?.followers?.length} followers
          </NavLink>
        </div>
        <div className='profile-info__following'>
          <NavLink
            to={`/user/${user?.nickname}/following`}
            style={{ color: 'black' }}
          >
            {user?.following?.length} following
          </NavLink>
        </div>
      </header>

      <div className='profile-posts'>
        {posts.map(post => (
          <Post post={post} key={post._id} />
        ))}
      </div>

      <div className='profile__pagination'>
        <Pagination
          currentPage={page}
          pagesCount={pagesCount}
          setPage={setPage}
        />
      </div>
    </div>
  );
};
