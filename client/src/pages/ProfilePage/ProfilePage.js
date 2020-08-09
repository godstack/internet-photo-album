import React, { useEffect, useContext, useState } from 'react';
import { useHttp } from '../../hooks/http.hook';
import { Loader } from '../../components/Loader/Loader';
import { AuthContext } from '../../context/AuthContext';
import { useMessage } from '../../hooks/useMessage';

import './ProfilePage.css';
import { Post } from '../../components/Post/Post';
import { useHistory } from 'react-router-dom';

export const ProfilePage = props => {
  const [posts, setPosts] = useState([]);
  const message = useMessage();
  const history = useHistory();
  const { loading, request, error, clearError } = useHttp();
  const auth = useContext(AuthContext);

  const getProfilePosts = async () => {
    const fetchedPosts = await request('/api/user/profile', 'GET', null, {
      authorization: `Bearer ${auth.token}`
    });

    setPosts(fetchedPosts);
  };

  const showPosts = () => {
    if (!posts.length) {
      return (
        <p className='profile-posts__empty'>Tou didn't add any post yet</p>
      );
    }

    return (
      <>
        <div className='profile-page__info'>
          <div className='posts-amount'>
            <span>{posts.length}</span> Posts
          </div>
        </div>
        <div className='profile-posts'>
          {posts.map(post => (
            <Post post={post} key={post._id} />
          ))}
        </div>
      </>
    );
  };

  useEffect(() => {
    message(error);

    if (error?.toLowerCase() === 'no authorization') {
      auth.logout();
      history.push('/');
    }

    clearError();
  }, [message, error, clearError]);

  useEffect(() => {
    getProfilePosts();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className='profile-page'>
      <h2>
        <i className='far fa-id-badge'></i> Profile
      </h2>

      {showPosts()}
    </div>
  );
};
