import React from 'react';
import './PostCard.css';

export const PostCard = props => {
  const { post } = props;

  const base64data = Buffer.from(post.postImage.data, 'binary').toString(
    'base64'
  );

  return (
    <div className='post-card'>
      <div className='placeholder'>
        <img src={`data:image/jpeg;base64,${base64data}`} alt='post' />
      </div>
      <div className='post-card__additional'>
        <div>
          <i className='far fa-heart'></i>
        </div>
        <div>Liked by {post.likes.length} people</div>
        <div>Creation date: {new Date(post.date).toLocaleDateString()}</div>
      </div>
    </div>
  );
};
