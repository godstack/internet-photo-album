import React from 'react';
import './InfoBlock.css';

export const InfoBlock = ({ icon, title, text }) => {
  return (
    <section className='info-block'>
      <section className='icon-wrapper'>
        <i className={icon}></i>
      </section>
      <p className='info-block__title'>{title}</p>
      <p className='info-block__text'>{text}</p>
    </section>
  );
};
