import React, { useEffect, useContext, useState } from 'react';
import { useHttp } from '../../hooks/http.hook';
import { Loader } from '../../components/Loader/Loader';
import { AuthContext } from '../../context/AuthContext';
import { useMessage } from '../../hooks/useMessage';
import imageCompression from 'browser-image-compression';
import { Post } from '../../components/Post/Post';
import { useParams, useHistory } from 'react-router-dom';

import './ProfilePage.css';
import { FileInput } from '../../components/FileInput/FileInput';

export const ProfilePage = props => {
  const [posts, setPosts] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const { nickname } = useParams();

  const message = useMessage();
  const history = useHistory();
  const { request, error, clearError, loading } = useHttp();

  const auth = useContext(AuthContext);

  const fetchInfo = async () => {
    const data = await request(`/api/user/profile/${nickname}`, 'GET', null, {
      authorization: `Bearer ${auth.token}`
    });

    if (data?.user?.profilePhoto) {
      data.user.profilePhoto = Buffer.from(
        data.user.profilePhoto,
        'binary'
      ).toString('base64');
    }

    setPosts(data.posts);
    setUser(data.user);
  };

  useEffect(() => {
    message(error);

    if (error?.toLowerCase() === 'no authorization') {
      auth.logout();
      history.push('/login');
    }

    clearError();
  }, [message, error, clearError]);

  useEffect(() => {
    fetchInfo();
  }, []);

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
              alt='profile-photo'
            />
          ) : (
            <p>No profile photo</p>
          )}
        </div>

        <section className='profile-info'>
          <div>
            <h2 className='profile-info__nickname'>{user?.nickname}</h2>
          </div>
          <ul className='profile-info__amount'>
            <li>{posts?.length} posts</li>
            <li className='clickable'>{user?.followers?.length} followers</li>
            <li className='clickable'>{user?.following?.length} following</li>
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
