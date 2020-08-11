import React, { useState, useContext, useEffect } from 'react';
import { useHttp } from '../../hooks/http.hook';
import { useMessage } from '../../hooks/useMessage';
import { AuthContext } from '../../context/AuthContext';
import { Loader } from '../../components/Loader/Loader';
import './AuthPages.css';

import { NavLink, useHistory } from 'react-router-dom';

export const RegisterPage = () => {
  const [form, setForm] = useState({ email: '', password: '', nickname: '' });
  const { loading, request, error, clearError } = useHttp();
  const history = useHistory();
  const auth = useContext(AuthContext);

  const message = useMessage();

  const registerHandler = async () => {
    try {
      const data = await request('/api/auth/register', 'POST', { ...form });
      history.push('/login');
      history.message(data.message);
    } catch (e) {}
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
