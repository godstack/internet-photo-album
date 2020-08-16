import React from 'react';
import './FileInput.css';

export const FileInput = ({
  loading,
  uploadHandler,
  handleChange,
  title,
  filename
}) => {
  return (
    <div className='file-input'>
      <div className='grey-input'>
        <div className='form-group'>
          <label className='label'>
            <i className='fas fa-paperclip'></i>
            <span className='title'>{title}</span>
            <input
              type='file'
              onChange={handleChange}
              name='file'
              accept='image/*'
            />
          </label>
          <p className='selected-file-name'>
            Selected file: {filename || "You haven't selected a file yet"}
          </p>
        </div>
      </div>

      <button
        className='btn btn-add'
        onClick={uploadHandler}
        disabled={loading}
      >
        Upload
      </button>
    </div>
  );
};
