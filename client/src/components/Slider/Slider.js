import React, { useState } from 'react';
import './Slider.css';

export const Slider = props => {
  const [images, setImages] = useState(props.images);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLooped, setIsLooped] = useState(false);

  const SlideHandler = e => {
    if (e.target.dataset.direction === 'next') {
      currentImageIndex < images.length - 1
        ? setCurrentImageIndex(currentImageIndex + 1)
        : setCurrentImageIndex(0);
    } else {
      currentImageIndex > 0
        ? setCurrentImageIndex(currentImageIndex - 1)
        : setCurrentImageIndex(images.length - 1);
    }
  };

  return (
    <div className='slider'>
      <button
        data-direction='prev'
        onClick={SlideHandler}
        className='slider__btn slider__btn-prev'
      >
        <i className='fas fa-arrow-circle-left'></i>
      </button>
      <img src={images[currentImageIndex]} alt='' className='slider__img' />
      <p className='slider__counter'>
        {currentImageIndex + 1} of {images.length}
      </p>
      <button
        data-direction='next'
        onClick={SlideHandler}
        className='slider__btn slider__btn-next'
      >
        <i className='fas fa-arrow-circle-right'></i>
      </button>
    </div>
  );
};