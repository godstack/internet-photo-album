import React from 'react';
import './ProfileImage.css';

export const ProfileImage = ({ photo }) => {
  return (
    <section className='profile-image-wrapper'>
      {photo ? (
        <div
          className='profile-image'
          style={{
            background: `url("data:image/jpeg;base64,${photo}")`,
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
          }}
        />
      ) : (
        <i className='far fa-eye-slash'></i>
      )}
    </section>
  );
};
