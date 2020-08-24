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

    auth.login({ ...data });
  };

  return (
    <section className='auth-page'>
      {loading && <Loader />}

      <section className='form-container'>
        <header className='form__header'>
          <h3 className='form__type'>Account login</h3>
          <NavLink className='form__redirect' to='/register'>
            Register
          </NavLink>
        </header>
        <section className='input-field'>
          <input
            type='text'
            name='email'
            placeholder='Enter email or nickname'
            onChange={handleChange}
          />
          <label htmlFor='email'>Email or Nickname</label>
        </section>

        <section className='input-field'>
          <input
            type='password'
            name='password'
            placeholder='Enter password'
            onChange={handleChange}
          />
          <label htmlFor='password'>Password</label>
        </section>

        <button disabled={loading} className='btn-auth' onClick={loginHandler}>
          Login
        </button>
      </section>
    </section>
  );
};
