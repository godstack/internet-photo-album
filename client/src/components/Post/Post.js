import React from 'react';
import { useHistory } from 'react-router-dom';
import './Post.css';

export const Post = props => {
  const { post } = props;

  const history = useHistory();

  const base64data = Buffer.from(post.photo.data, 'binary').toString('base64');

  const redirectToPostPage = () => {
    history.push(`/post/${post._id}`);
  };

  return (
    <div className='post' onClick={redirectToPostPage}>
      <div className='placeholder'>
        <img src={`data:image/jpeg;base64,${base64data}`} alt='post' />
      </div>
      <div></div>
    </div>
  );
};
