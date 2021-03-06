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

  const handleDeletePost = async () => {
    const data = await request(
      '/api/post/delete',
      'DELETE',
      { postId: post._id },
      {
        authorization: `Bearer ${auth.user.token}`
      }
    );

    message(data.message);

    history.push(`user/${props.postedBy}`);
  };

  return (
    <>
      {loading && <Loader />}
      <section className='post-card'>
        <NavLink className='post-card__nickname' to={`/user/${props.postedBy}`}>
          {props.postedBy}
        </NavLink>

        {auth.user.nickname === props.postedBy ? (
          <i
            className='far fa-trash-alt post-card__delete'
            onClick={handleDeletePost}
          ></i>
        ) : null}
        <section className='post-card__img-wrapper'>
          <div
            className='post-card__img'
            style={{
              background: `url("data:image/jpeg;base64,${base64data}")`,
              backgroundPosition: 'center',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat'
            }}
          ></div>
        </section>
        <section className='post-card__additional'>
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
        </section>
      </section>
    </>
  );
};
