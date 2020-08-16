import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useHttp } from '../../hooks/http.hook';
import { useParams, useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

import { Loader } from '../../components/Loader/Loader';
import './UserListPage.css';
import { useMessage } from '../../hooks/useMessage';
import { UserItem } from '../../components/UserItem/UserItem';
import { Pagination } from '../../components/Pagination/Pagination';

export const UserListPage = ({ userListType }) => {
  const { nickname } = useParams();
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(null);
  const [userList, setUserList] = useState(null);

  const { request, loading, error, clearError } = useHttp();
  const message = useMessage();
  const auth = useContext(AuthContext);
  const history = useHistory();

  const fetchUserList = useCallback(async () => {
    const data = await request(
      `/api/user/${nickname}/${userListType}`,
      'GET',
      null,
      {
        authorization: `Bearer ${auth.user.token}`
      }
    );

    setUserList(data.userList);
  }, [auth.user.token, nickname, request, userListType]);

  const fetchAllUsersList = useCallback(
    async currentPage => {
      const data = await request(
        `/api/users/get?page=${currentPage}`,
        'GET',
        null,
        {
          authorization: `Bearer ${auth.user.token}`
        }
      );

      setUserList(data.userList);
      setMaxPage(data.pagesCount);
    },
    [auth.user.token, request]
  );

  useEffect(() => {
    message(error);

    if (error?.toLowerCase() === 'no authorization') {
      auth.logout();
      history.push('/login');
    }

    clearError();
  }, [message, clearError, error, auth, history]);

  useEffect(() => {
    if (userListType === 'following' || userListType === 'followers') {
      fetchUserList();
    } else if (userListType === 'all users') {
      fetchAllUsersList(page);
    }
  }, [fetchUserList, fetchAllUsersList, page]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className='user-list-wrapper'>
      <div className='userlist'>
        <header className='userlist__header'>{userListType}</header>
        <div className='userlist__list'>
          {userList?.map(user => (
            <UserItem user={user} key={user.nickname} />
          ))}
        </div>
      </div>

      <Pagination currentPage={page} pageCount={maxPage} setPage={setPage} />
    </div>
  );
};
