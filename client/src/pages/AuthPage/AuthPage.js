import React, { useState, useEffect, useContext } from 'react';
import './AuthPage.css';
import { useHttp } from '../../hooks/http.hook';
import { useMessage } from '../../hooks/useMessage';
import { AuthContext } from '../../context/AuthContext';

export const AuthPage = () => {
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

  const registerHandler = async () => {
    try {
      const data = await request('/api/auth/register', 'POST', { ...form });

      message(data.message);
    } catch (e) {}
  };

  const loginHandler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', { ...form });

      auth.login(data.token, data.userId);
    } catch (e) {}
  };

  return (
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
        <button
          disabled={loading}
          className='btn btn-register'
          onClick={registerHandler}
        >
          Register
        </button>
      </div>
    </div>
  );
};
