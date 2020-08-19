import React from 'react';
import './ProfileImage.css';

export const ProfileImage = ({ photo, imageSize }) => {
  return (
    <div
      className='profile-image-wrapper'
      style={{ width: `${imageSize + 15}px`, height: `${imageSize + 15}px` }}
    >
      {photo ? (
        <img
          className='profile-image'
          src={`data:image/jpeg;base64,${photo}`}
          alt='profile'
        />
      ) : (
        <p className='no-photo__p'>No profile photo</p>
      )}
    </div>
  );
};
