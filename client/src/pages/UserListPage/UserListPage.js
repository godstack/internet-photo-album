import React, { useState, useEffect, useContext } from 'react';
import { useHttp } from '../../hooks/http.hook';
import { useParams, useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

import { Loader } from '../../components/Loader/Loader';
import './UserListPage.css';
import { useMessage } from '../../hooks/useMessage';
import { UserItem } from '../../components/UserItem/UserItem';

export const UserListPage = () => {
  const { nickname } = useParams();
  const [userList, setUserList] = useState(null);
  const [userListType, setUserListType] = useState(
    window.location.href.split('/').pop()
  );
  const { request, loading, error, clearError } = useHttp();
  const message = useMessage();
  const auth = useContext(AuthContext);
  const history = useHistory();

  const fetchUserList = async () => {
    const data = await request(
      `/api/user/${nickname}/${userListType}`,
      'GET',
      null,
      {
        authorization: `Bearer ${auth.user.token}`
      }
    );

    setUserList(data.userList);
  };

  useEffect(() => {
    message(error);

    if (error?.toLowerCase() === 'no authorization') {
      auth.logout();
      history.push('/login');
    }

    clearError();
  }, [message, clearError, error]);

  useEffect(() => {
    fetchUserList();

    console.log(userList);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className='user-list-wrapper'>
      <div className='userlist'>
        <header className='userlist__header'>{userListType}</header>
        <div className='userlist__list'>
          {userList?.map(user => (
            <UserItem user={user} />
          ))}
        </div>
      </div>
    </div>
  );
};
