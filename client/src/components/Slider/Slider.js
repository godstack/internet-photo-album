import React, { useState } from 'react';
import './Slider.css';

export const Slider = props => {
  const { images } = props;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextSlideHandler = e => {
    currentImageIndex < images.length - 1
      ? setCurrentImageIndex(currentImageIndex + 1)
      : setCurrentImageIndex(0);
  };

  const prevSlideHandler = e => {
    currentImageIndex > 0
      ? setCurrentImageIndex(currentImageIndex - 1)
      : setCurrentImageIndex(images.length - 1);
  };

  return (
    <section className='slider'>
      <button
        onClick={prevSlideHandler}
        className='slider__btn slider__btn-prev'
      >
        <i className='fas fa-arrow-circle-left'></i>
      </button>
      <section className='slider__img-wrapper'>
        <img src={images[currentImageIndex]} alt='' className='slider__img' />
        <p className='slider__counter'>
          {currentImageIndex + 1} of {images.length}
        </p>
      </section>
      <button
        onClick={nextSlideHandler}
        className='slider__btn slider__btn-next'
      >
        <i className='fas fa-arrow-circle-right'></i>
      </button>
    </section>
  );
};
