import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
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

  useEffect(() => {
    message(error);

    if (error?.toLowerCase() === 'no authorization') {
      auth.logout();
      history.push('/');
    }

    clearError();
  }, [message, clearError, error]);

  const [isLiked, setIsLiked] = useState(
    !!post.likes.find(el => el === auth.userId)
  );

  const base64data = Buffer.from(post.postImage.data, 'binary').toString(
    'base64'
  );

  const handleLikePost = async () => {
    const data = await request(
      '/api/post/like',
      'PUT',
      { postId: post._id },
      {
        authorization: `Bearer ${auth.token}`
      }
    );

    setPost(data);

    setIsLiked(!!data.likes.find(el => el === auth.userId));
  };

  return (
    <>
      {loading && <Loader />}
      <div className='post-card'>
        <div className='placeholder'>
          <img src={`data:image/jpeg;base64,${base64data}`} alt='post' />
        </div>
        <div className='post-card__additional'>
          <button
            onClick={handleLikePost}
            className='post-card__like'
            disabled={loading}
          >
            {isLiked ? (
              <i class='fas fa-heart'></i>
            ) : (
              <i className='far fa-heart'></i>
            )}
          </button>
          <div>Liked by {post.likes.length} people</div>
          <div>Creation date: {new Date(post.date).toLocaleDateString()}</div>
        </div>
      </div>
    </>
  );
};
