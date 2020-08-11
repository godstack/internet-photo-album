import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { LoginPage } from './pages/AuthPages/LoginPage';
import { RegisterPage } from './pages/AuthPages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage/ProfilePage';
import { CreatePage } from './pages/CreatePage/CreatePage';
import { PostPage } from './pages/PostPage/PostPage';

export const useRoutes = isAuthenticated => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route exact path='/profile' component={ProfilePage} />
        <Route exact path='/add' component={CreatePage} />
        <Route exact path='/post/:postId' component={PostPage} />

        <Redirect to='/profile' />
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
