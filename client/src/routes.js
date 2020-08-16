import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { LoginPage } from './pages/AuthPages/LoginPage';
import { RegisterPage } from './pages/AuthPages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage/ProfilePage';
import { CreatePage } from './pages/CreatePage/CreatePage';
import { PostPage } from './pages/PostPage/PostPage';
import { UserListPage } from './pages/UserListPage/UserListPage';

export const useRoutes = (isAuthenticated, nickname) => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route exact path='/user/:nickname' component={ProfilePage} />
        <Route exact path='/addpost' component={CreatePage} />
        <Route exact path='/post/:postId' component={PostPage} />
        <Route exact path='/user/:nickname/followers'>
          <UserListPage userListType={'followers'} />
        </Route>
        <Route exact path='/user/:nickname/following'>
          <UserListPage userListType={'following'} />
        </Route>
        <Route exact path='/users'>
          <UserListPage userListType={'all users'} />
        </Route>

        <Redirect to={`/user/${nickname}`} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route exact path='/login' component={LoginPage} />
      <Route exact path='/register' component={RegisterPage} />
      <Redirect to='/login' />
    </Switch>
  );
};
