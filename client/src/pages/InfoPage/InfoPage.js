import React from 'react';

import { Slider } from '../../components/Slider/Slider';
// import Maps from '../../components/Maps/Maps';

export const InfoPage = () => {
  const images = [
    'https://apriori-center.org/wp-content/uploads/2016/07/Evolution_by_will_yen-500x500.png',
    'https://dspncdn.com/a1/media/692x/da/16/db/da16db98ddabeae42495ff003d1efbc8.jpg',
    'https://pajulahti.com/wp-content/uploads/2017/04/500x500.jpeg',
    'https://i.kfs.io/album/global/71602135,0v1/fit/500x500.jpg'
  ];

  return (
    <div className='info-page'>
      <Slider images={images} />
      {/* <Maps /> */}
    </div>
  );
};
