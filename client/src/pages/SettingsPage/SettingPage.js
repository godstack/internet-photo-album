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

  const [form, setForm] = useState({ nickname: '', email: '', file: null });

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
    debugger;
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
    setDisabled(true);
    debugger;
    name === 'file'
      ? setForm({ ...form, [name]: files[0] })
      : setUser({ ...user, [name]: value });
    console.log(JSON.stringify(form));
  };

  const uploadHandler = async () => {
    if (form.file) {
      setLoading(true);
      const fd = new FormData();

      console.log(`originalFile size ${form.file.size / 1024 / 1024} MB`);

      const options = {
        maxSizeMB: 0.05,
        maxWidthOrHeight: 500,
        useWebWorker: true
      };

      const compressedFile = await imageCompression(form.file, options);

      console.log(
        `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
      ); // smaller than maxSizeMB

      fd.append('image', compressedFile, form.file.name);

      const data = await request(
        '/api/user/settings/photo',
        'POST',
        fd,
        {
          authorization: `Bearer ${auth.user.token}`
        },
        false
      );

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
          title={'Change profile image'}
          filename={form?.file?.name}
        />
      </div>

      <div className='input-field'>
        <input
          type='text'
          name='nickname'
          placeholder='Nickname'
          onChange={handleChange}
        />
        <label htmlFor='nickname'>Nickname</label>
      </div>

      <div className='input-field'>
        <input
          type='text'
          name='email'
          placeholder='Email'
          onChange={handleChange}
        />
        <label htmlFor='email'>Email</label>
      </div>

      <button className='btn'>Apply Changes</button>
    </div>
  );
};
