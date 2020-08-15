import React, { useState, useEffect } from 'react';
import { useHttp } from '../../hooks/http.hook';
import { useMessage } from '../../hooks/useMessage';

import { Loader } from '../../components/Loader/Loader';
import './AuthPages.css';

import { NavLink, useHistory } from 'react-router-dom';

export const RegisterPage = () => {
  const [form, setForm] = useState({ email: '', password: '', nickname: '' });
  const { loading, request, error, clearError } = useHttp();
  const history = useHistory();

  const message = useMessage();

  const registerHandler = async () => {
    const data = await request('/api/auth/register', 'POST', { ...form });

    if (data.message === 'New user was created') {
      history.push('/login');
    }

    message(data.message);
  };

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  const handleChange = e => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });
  };

  return (
    <>
      {loading && <Loader />}
      <div className='form-container'>
        <div className='input-field'>
          <input
            type='text'
            name='email'
            placeholder='Enter email'
            onChange={handleChange}
          />
          <label htmlFor='email'>Email</label>
        </div>

        <div className='input-field'>
          <input
            type='text'
            name='nickname'
            placeholder='Enter nickname'
            onChange={handleChange}
          />
          <label htmlFor='nickname'>Nickname</label>
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
            className='btn btn-register'
            onClick={registerHandler}
          >
            Register
          </button>
        </div>
        <div className='form-link'>
          <NavLink to='/login'>
            Already have an account? Go to Login page
          </NavLink>
        </div>
      </div>
    </>
  );
};