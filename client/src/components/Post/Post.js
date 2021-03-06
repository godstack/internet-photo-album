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
    <section className='post-wrapper'>
      <div
        className='post'
        onClick={redirectToPostPage}
        style={{
          background: `url("data:image/jpeg;base64,${base64data}")`,
          backgroundPosition: 'center',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
    </section>
  );
};
