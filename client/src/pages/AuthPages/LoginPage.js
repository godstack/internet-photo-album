import React, { useState, useContext } from 'react';

import { useHttp } from '../../hooks/http.hook';
import { useMessage } from '../../hooks/useMessage';
import { AuthContext } from '../../context/AuthContext';
import { Loader } from '../../components/Loader/Loader';
import './AuthPages.css';
import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';

export const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const { loading, request, error, clearError } = useHttp();

  const auth = useContext(AuthContext);

  const message = useMessage();

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  const handleChange = e => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });
  };

  const loginHandler = async () => {
    const data = await request('/api/auth/login', 'POST', { ...form });

    auth.login(data.token, data.userId, data.nickname);
  };

  return (
    <>
      {loading && <Loader />}
      <div className='form-container'>
        <div className='input-field'>
          <input
            type='text'
            name='email'
            placeholder='Enter email or nickname'
            onChange={handleChange}
          />
          <label htmlFor='email'>Email or Nickname</label>
        </div>

        <div className='input-field'>
          <input
            type='password'
            name='password'
            placeholder='Enter password'
            onChange={handleChange}
          />
          <label htmlFor='password'>Password</label>
        </div>

        <div className='buttons'>
          <button
            disabled={loading}
            className='btn btn-login'
            onClick={loginHandler}
          >
            Login
          </button>
        </div>
        <div className='form-link'>
          <NavLink to='/register'>
            Still don't have an account? Go to Register page
          </NavLink>
        </div>
      </div>
    </>
  );
};
