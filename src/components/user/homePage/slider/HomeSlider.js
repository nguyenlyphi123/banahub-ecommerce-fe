import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './CustomSlick.css';

export default function HomeSlider() {
  let settings = {
    dots: true,
    autoplay: true,
    autoplaySpeed: 5000,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <Slider {...settings}>
      <div>
        <img
          style={{ width: '100%' }}
          src='https://firebasestorage.googleapis.com/v0/b/salemanager-11c9a.appspot.com/o/images%2Fslide4.jpg?alt=media&token=557bab0d-2398-47ae-ae41-6b53f03611d5'
          alt=''
        />
      </div>
      <div>
        <img
          style={{ width: '100%' }}
          src='https://firebasestorage.googleapis.com/v0/b/salemanager-11c9a.appspot.com/o/images%2Fslide2.png?alt=media&token=abc7aea2-f36d-4584-9569-15699017d80c'
          alt=''
        />
      </div>
      <div>
        <img
          style={{ width: '100%' }}
          src='https://firebasestorage.googleapis.com/v0/b/salemanager-11c9a.appspot.com/o/images%2Fslide5.jpg?alt=media&token=28ccc56a-6d13-4ec5-bba8-2d65a632fbd9'
          alt=''
        />
      </div>
    </Slider>
  );
}
