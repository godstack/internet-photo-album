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
  const [pagesCount, setPagesCount] = useState(null);
  const [userList, setUserList] = useState(null);
  const [nicknameToSearch, setNicknameToSearch] = useState('');

  const { request, loading, error, clearError } = useHttp();
  const message = useMessage();
  const auth = useContext(AuthContext);
  const history = useHistory();

  const fetchUserList = useCallback(
    async (currentPage, search) => {
      const data = await request(
        `/api/user/${nickname}/${userListType}?page=${currentPage}&&search=${search}`,
        'GET',
        null,
        {
          authorization: `Bearer ${auth.user.token}`
        }
      );

      setUserList(data.userList);
      setPagesCount(data.pagesCount);
    },
    [auth.user.token, nickname, request, userListType]
  );

  const fetchAllUsersList = useCallback(
    async (currentPage, search) => {
      const data = await request(
        `/api/users/get?page=${currentPage}&&search=${search}`,
        'GET',
        null,
        {
          authorization: `Bearer ${auth.user.token}`
        }
      );

      setUserList(data.userList);
      setPagesCount(data.pagesCount);
    },
    [auth.user.token, request]
  );

  const handleSearch = () => {
    if (setNicknameToSearch) {
      setPage(1);

      if (userListType === 'following' || userListType === 'followers') {
        fetchUserList(page, nicknameToSearch);
      } else if (userListType === 'all users') {
        fetchAllUsersList(page, nicknameToSearch);
      }
    }
  };

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
      fetchUserList(page, nicknameToSearch);
    } else if (userListType === 'all users') {
      fetchAllUsersList(page, nicknameToSearch);
    }
  }, [fetchUserList, fetchAllUsersList, page, userListType]);

  if (loading) {
    return <Loader />;
  }

  return (
    <section className='user-list-wrapper'>
      <section className='users-search'>
        <section className='input-field'>
          <input
            type='text'
            name='nicknameToSearch'
            value={nicknameToSearch}
            placeholder='Search users'
            onChange={e => setNicknameToSearch(e.target.value)}
          />
          <label htmlFor='email'>Enter Nickname</label>
        </section>
        <button className='btn user-list__search' onClick={handleSearch}>
          Search
        </button>
      </section>

      <section className='userlist'>
        <header className='userlist__header'>{userListType}</header>
        <section className='userlist__list'>
          {userList?.map(user => (
            <UserItem user={user} key={user.nickname} request={request} />
          ))}

          {!userList?.length && <p className='userlist__message'>Empty</p>}
        </section>
      </section>

      <Pagination
        currentPage={page}
        pagesCount={pagesCount}
        setPage={setPage}
      />
    </section>
  );
};
