import React, { useState, useCallback, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useHttp } from '../../hooks/http.hook';
import './PostPage.css';
import { useMessage } from '../../hooks/useMessage';
import { AuthContext } from '../../context/AuthContext';
import { Loader } from '../../components/Loader/Loader';
import { PostCard } from '../../components/PostCard/PostCard';
import { useAuth } from '../../hooks/auth.hook';

export const PostPage = () => {
  const [post, setPost] = useState(null);
  const history = useHistory();

  const auth = useAuth();

  const { request, loading, error, clearError } = useHttp();
  const { postId } = useParams();
  const { token } = useContext(AuthContext);
  const message = useMessage();

  useEffect(() => {
    message(error);

    if (error?.toLowerCase() === 'no authorization') {
      auth.logout();
      history.push('/');
    }

    clearError();
  }, [error, message, clearError]);

  const getPost = useCallback(async () => {
    try {
      const fetched = await request(`/api/post/${postId}`, 'GET', null, {
        authorization: `Bearer ${token}`
      });

      setPost(fetched);
    } catch (e) {
      message(e);
    }
  }, [token, postId, request]);

  useEffect(() => {
    getPost();
  }, [getPost]);

  if (loading) {
    return <Loader />;
  }

  return <>{!loading && post && <PostCard post={post} />}</>;
};
