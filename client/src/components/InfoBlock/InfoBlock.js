import React from 'react';
import './InfoBlock.css';

export const InfoBlock = ({ icon, title, text }) => {
  return (
    <div className='info-block'>
      <div className='icon-wrapper'>
        <i className={icon}></i>
      </div>
      <p className='info-block__title'>{title}</p>
      <p className='info-block__text'>{text}</p>
    </div>
  );
};
