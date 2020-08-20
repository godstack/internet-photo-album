import React from 'react';
import './InfoPage.css';
import Maps from '../../components/Maps/Maps';
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
    <div className='info-page'>
      <h2 className='info-page__title'>Contact Trembola</h2>
      <p className='info-page__tagline'>Get in touch with us</p>
      <div className='info-page__contacts'>
        <InfoBlock icon='fas fa-at' title='Email' text='trembola@gmail.com' />
        <InfoBlock icon='fas fa-phone' title='Phone' text='555-555' />
        <InfoBlock
          icon='far fa-newspaper'
          title='Project Planner'
          text='godlexa'
        />
        <InfoBlock icon='fab fa-instagram' title='Instagram' text='godlexa' />
      </div>
      <div className='info-page__map'>{/* <Maps/> */}</div>
      <div className='info-page__address'>
        <h3 className='address__h3'>OUR ADDRESS</h3>
        <ul className='address__ul'>
          <li>Vinnytsia</li>
          <li>Pirogova street</li>
          <li>42 House</li>
        </ul>
      </div>
      <div className='info-page__office'>
        <h4 className='office__header'>Our Office</h4>
        <Slider images={images} />
      </div>
    </div>
  );
};
