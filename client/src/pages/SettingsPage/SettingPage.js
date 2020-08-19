import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useHttp } from '../../hooks/http.hook';
import { Loader } from '../../components/Loader/Loader';
import { useMessage } from '../../hooks/useMessage';

import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FileInput } from '../../components/FileInput/FileInput';
import imageCompression from 'browser-image-compression';
import './SettingsPage.css';
import { ProfileImage } from '../../components/ProfileImage/ProfileImage';

export const SettingsPage = () => {
  const [user, setUser] = useState(null);
  const [disabled, setDisabled] = useState(true);

  const [file, setFile] = useState(null);

  const [form, setForm] = useState({ nickname: '', email: '' });

  const { request, error, clearError } = useHttp();
  const [loading, setLoading] = useState(false);
  const message = useMessage();
  const history = useHistory();

  const auth = useContext(AuthContext);

  const fetchSourceUserInfo = useCallback(async () => {
    setLoading(true);
    const data = await request(`/api/user/settings`, 'GET', null, {
      authorization: `Bearer ${auth.user.token}`
    });

    if (data?.profilePhoto) {
      data.profilePhoto = Buffer.from(data.profilePhoto, 'binary').toString(
        'base64'
      );
    }

    setUser(data);
    setForm({ ...form, nickname: data.nickname, email: data.email });
    setLoading(false);
  }, []);

  const handleChange = async e => {
    const { name, value, files } = e.target;
    setDisabled(false);

    name === 'file'
      ? setForm({ ...form, [name]: files[0] })
      : setForm({ ...form, [name]: value });
  };

  const uploadHandler = async () => {
    if (form.file) {
      setLoading(true);
      const fd = new FormData();

      const options = {
        maxSizeMB: 0.05,
        maxWidthOrHeight: 500,
        useWebWorker: true
      };

      const compressedFile = await imageCompression(form.file, options);

      fd.append('image', compressedFile, form.file.name);

      await request(
        '/api/user/settings/photo',
        'POST',
        fd,
        {
          authorization: `Bearer ${auth.user.token}`
        },
        false
      );

      history.push(`/user/${auth.user.nickname}`);

      setLoading(false);
    } else {
      message('Select an image!');
    }
  };

  useEffect(() => {
    fetchSourceUserInfo();
  }, [fetchSourceUserInfo]);

  useEffect(() => {
    message(error);

    if (error?.toLowerCase() === 'no authorization') {
      auth.logout();
      history.push('/login');
    }

    clearError();
  }, [message, clearError, error, auth, history]);

  const submitChanges = async () => {
    const data = await request(
      '/api/user/settings/change',
      'PUT',
      { nickname: form.nickname, email: form.email },
      {
        authorization: `Bearer ${auth.user.token}`
      }
    );

    setUser({ ...user, ...data.new });

    auth.login({ ...auth.user, nickname: data.new.nickname });
    message(data.message);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className='settings'>
      <div className='image-field'>
        <ProfileImage photo={user?.profilePhoto} imageSize={150} />

        <FileInput
          loading={loading}
          uploadHandler={uploadHandler}
          handleChange={handleChange}
          title={'Profile image'}
          filename={form?.file?.name}
        />
      </div>

      <div className='input-field'>
        <input
          type='text'
          name='nickname'
          placeholder='Nickname'
          value={form.nickname}
          onChange={handleChange}
        />
        <label htmlFor='nickname'>Nickname</label>
      </div>

      <div className='input-field'>
        <input
          type='text'
          name='email'
          placeholder='Email'
          value={form.email}
          onChange={handleChange}
        />
        <label htmlFor='email'>Email</label>
      </div>

      <button
        className='btn settings-btn'
        disabled={disabled}
        onClick={submitChanges}
      >
        Apply Changes
      </button>
    </div>
  );
};
