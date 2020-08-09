import React, { useState, useContext, useEffect } from 'react';
import { useHttp } from '../../hooks/http.hook';
import { AuthContext } from '../../context/AuthContext';
import { useHistory } from 'react-router-dom';
import './CreatePage.css';
import { useMessage } from '../../hooks/useMessage';
import { Loader } from '../../components/Loader/Loader';
import imageCompression from 'browser-image-compression';

export const CreatePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const auth = useContext(AuthContext);
  const history = useHistory();
  const message = useMessage();

  const { request, error, clearError } = useHttp();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    message(error);

    if (error?.toLowerCase() === 'no authorization') {
      auth.logout();
      history.push('/');
    }

    clearError();
  }, [message, clearError, error]);

  const fileSelectedHandler = e => {
    setSelectedFile(e.target.files[0]);
  };

  const fileUploadHandler = async () => {
    if (selectedFile) {
      try {
        setLoading(true);
        const fd = new FormData();

        console.log(`originalFile size ${selectedFile.size / 1024 / 1024} MB`);

        const options = {
          maxSizeMB: 0.05,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        };

        const compressedFile = await imageCompression(selectedFile, options);

        console.log(
          `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
        ); // smaller than maxSizeMB

        fd.append('image', compressedFile, selectedFile.name);

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
          <div className='input-field'>
            <input
              type='file'
              onChange={fileSelectedHandler}
              name='postImage'
              accept='image/*'
            />
            <label htmlFor='selectedFile'>Upload photos</label>
          </div>

          <button
            className='btn btn-add'
            onClick={fileUploadHandler}
            disabled={loading}
          >
            Upload
          </button>
        </div>
      </div>
    </>
  );
};
