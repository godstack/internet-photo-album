import React from 'react';
import './Loader.css';

export const Loader = () => {
  return (
    <div className='loader'>
      <div className='loader__container'>
        <div className='item-1'></div>
        <div className='item-2'></div>
        <div className='item-3'></div>
        <div className='item-4'></div>
        <div className='item-5'></div>
      </div>
    </div>
  );
};
