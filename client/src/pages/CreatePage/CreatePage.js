import React, { useState, useContext, useEffect } from 'react';
import { useHttp } from '../../hooks/http.hook';
import { AuthContext } from '../../context/AuthContext';
import { useHistory } from 'react-router-dom';
import './CreatePage.css';
import { useMessage } from '../../hooks/useMessage';
import { Loader } from '../../components/Loader/Loader';

import imageCompression from 'browser-image-compression';
import { FileInput } from '../../components/FileInput/FileInput';

export const CreatePage = () => {
  const [form, setForm] = useState({ file: null });

  const auth = useContext(AuthContext);
  const history = useHistory();
  const message = useMessage();

  const { request, error, clearError } = useHttp();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    message(error);

    if (error?.toLowerCase() === 'no authorization') {
      auth.logout();
      history.push('/login');
    }

    clearError();
  }, [message, clearError, error]);

  const handleChange = async e => {
    const { name, value, files } = e.target;

    name === 'file'
      ? setForm({ ...form, [name]: files[0] })
      : setForm({ ...form, [name]: value });
  };

  const uploadHandler = async () => {
    if (form.file) {
      try {
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
          '/api/post/upload',
          'POST',
          fd,
          {
            authorization: `Bearer ${auth.token}`
          },
          false
        );

        setLoading(false);

        if (data._id) {
          history.push(`/post/${data._id}`);
        }
      } catch (error) {
        message(error);
      }
    } else {
      message('Select an image!');
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className='create-page'>
        <h2 className='create-page-header'>
          <i className='far fa-images'></i> Add new post
        </h2>
        <div className='create-post'>
          <FileInput
            loading={loading}
            uploadHandler={uploadHandler}
            handleChange={handleChange}
            title={'Select post photo'}
            filename={form?.file?.name || "You haven't selected a file yet"}
          />
        </div>
      </div>
    </>
  );
};
