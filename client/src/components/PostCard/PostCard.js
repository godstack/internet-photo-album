import React, { useState, useContext, useEffect } from 'react';
import { useHistory, NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useHttp } from '../../hooks/http.hook';
import { Loader } from '../Loader/Loader';
import { useMessage } from '../../hooks/useMessage';

import './PostCard.css';

export const PostCard = props => {
  const [post, setPost] = useState(props.post);

  const history = useHistory();
  const message = useMessage();

  const auth = useContext(AuthContext);

  const { request, loading, error, clearError } = useHttp();

  const base64data = Buffer.from(post.photo.data, 'binary').toString('base64');

  useEffect(() => {
    message(error);

    if (error?.toLowerCase() === 'no authorization') {
      auth.logout();
      history.push('/login');
    }

    clearError();
  }, [message, clearError, error, auth, history]);

  const handleLikePost = async () => {
    const data = await request(
      '/api/post/like',
      'PUT',
      { postId: post._id },
      {
        authorization: `Bearer ${auth.user.token}`
      }
    );

    setPost(data);
  };

  return (
    <>
      {loading && <Loader />}
      <div className='post-card'>
        <NavLink className='post-card__nickname' to={`/user/${props.postedBy}`}>
          {props.postedBy}
        </NavLink>
        <div className='post-card__img-wrapper'>
          <div
            className='post-card__img'
            style={{
              background: `url("data:image/jpeg;base64,${base64data}")`,
              backgroundPosition: 'center',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat'
            }}
          ></div>
        </div>
        <div className='post-card__additional'>
          <button
            onClick={handleLikePost}
            className='post-card__like'
            disabled={loading}
          >
            {post.likes.length}{' '}
            {!!post.likes.find(el => el === auth.user.userId) ? (
              <i className='fas fa-heart'></i>
            ) : (
              <i className='far fa-heart'></i>
            )}
          </button>

          <div className='post-card__additional-p'>
            {new Date(post.date).toLocaleDateString()}
          </div>
        </div>
      </div>
    </>
  );
};
