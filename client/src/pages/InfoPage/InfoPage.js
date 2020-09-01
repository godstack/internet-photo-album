import React from 'react';
import './InfoPage.css';

import { Slider } from '../../components/Slider/Slider';
import { InfoBlock } from '../../components/InfoBlock/InfoBlock';

export const InfoPage = () => {
  const images = [
    'https://i.pinimg.com/originals/c0/0a/a8/c00aa88cfe7bdc8a286ad9d34e272eac.jpg',
    'https://akvilegia.com/wp-content/uploads/2019/04/%D0%B4%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD-%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82-%D0%BE%D1%84%D0%B8%D1%81%D0%B0-IT-3-500x500.jpg',
    'https://akvilegia.com/wp-content/uploads/2019/04/%D0%B4%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD-%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82-%D0%BE%D1%84%D0%B8%D1%81%D0%B0-IT-500x500.jpg',
    'https://keep-services.com.ua/wp-content/uploads/2019/07/office.jpg'
  ];

  return (
    <section className='info-page'>
      <h2 className='info-page__title'>Contact Trembola</h2>
      <p className='info-page__tagline'>Get in touch with us</p>
      <section className='info-page__contacts'>
        <InfoBlock icon='fas fa-at' title='Email' text='trembola@gmail.com' />
        <InfoBlock icon='fas fa-phone' title='Phone' text='555-555' />
        <InfoBlock
          icon='far fa-newspaper'
          title='Project Planner'
          text='godlexa'
        />
        <InfoBlock icon='fab fa-instagram' title='Instagram' text='godlexa' />
      </section>

      <section className='info-page__address'>
        <h3 className='address__header'>OUR ADDRESS</h3>
        <p className='address_p'>21000, Vinnitsya, Soborna Street</p>
      </section>

      <section className='info-page__office'>
        <h4 className='office__header'>Our Office</h4>
        <Slider images={images} />
      </section>

      <section className='info-page__map'>
        <iframe
          width='100%'
          height='600'
          frameborder='0'
          scrolling='no'
          marginheight='0'
          marginwidth='0'
          src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Kotsyubyns'koho%20Ave,%2070,%20Vinnytsia,%20Vinnytsia%20Oblast,%2021000+(Trembola)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
        ></iframe>
      </section>
    </section>
  );
};
