import React, { useState, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../slider/CustomSlick.css';

export default function HomeRating() {
  let settings = {
    dots: false,
    autoplay: true,
    autoplaySpeed: 5000,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <div className='container-fluid mt-3 pl-0 pr-0'>
      <div className='text-center section-cmt p-4'>
        <h4 className='text-uppercase'>đánh giá</h4>
      </div>

      <Slider {...settings}>
        <div className='carousel-item active'>
          <div
            className='card card-center'
            style={{
              border: 'none',
              borderRadius: 0,
              backgroundColor: '#be9329',
            }}
          >
            <div className='section-center'>
              <div
                className='card-imgs'
                style={{
                  borderRadius: '50%',
                  width: '100px',
                  overflow: 'hidden',
                }}
              >
                <img
                  src='https://firebasestorage.googleapis.com/v0/b/banahub.appspot.com/o/images%2Fuser5.png?alt=media&token=82d75b98-a475-489f-a07f-63f3a5559a55'
                  alt=''
                  className='card-img-top'
                  style={{ width: '100px', height: '100px' }}
                />
              </div>
            </div>
            <div className='card-body w-75'>
              <p
                style={{ color: '#fff' }}
                className='card-text text-center pb-2'
              >
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor
                numquam quas mollitia possimus sequi. Enim sunt ea fugiat
                doloremque laboriosam harum neque ab! Possimus sed fugit nisi
                ullam consequatur architecto.
              </p>
            </div>
          </div>
        </div>
        <div className='carousel-item'>
          <div
            className='card card-center'
            style={{
              border: 'none',
              borderRadius: 0,
              backgroundColor: '#be9329',
            }}
          >
            <div className='section-center'>
              <div
                className='card-imgs'
                style={{
                  borderRadius: '50%',
                  width: '100px',
                  overflow: 'hidden',
                }}
              >
                <img
                  src='https://firebasestorage.googleapis.com/v0/b/banahub.appspot.com/o/images%2Fuser5.png?alt=media&token=82d75b98-a475-489f-a07f-63f3a5559a55'
                  alt=''
                  className='card-img-top'
                  style={{ width: '100px', height: '100px' }}
                />
              </div>
            </div>
            <div className='card-body w-75'>
              <p
                style={{ color: '#fff' }}
                className='card-text text-center pb-2'
              >
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor
                numquam quas mollitia possimus sequi. Enim sunt ea fugiat
                doloremque laboriosam harum neque ab! Possimus sed fugit nisi
                ullam consequatur architecto.
              </p>
            </div>
          </div>
        </div>
        <div className='carousel-item'>
          <div
            className='card card-center'
            style={{
              border: 'none',
              borderRadius: 0,
              backgroundColor: '#be9329',
            }}
          >
            <div className='section-center'>
              <div
                className='card-imgs'
                style={{
                  borderRadius: '50%',
                  width: '100px',
                  overflow: 'hidden',
                }}
              >
                <img
                  src='https://firebasestorage.googleapis.com/v0/b/banahub.appspot.com/o/images%2Fuser5.png?alt=media&token=82d75b98-a475-489f-a07f-63f3a5559a55'
                  alt=''
                  className='card-img-top'
                  style={{ width: '100px', height: '100px' }}
                />
              </div>
            </div>
            <div className='card-body w-75'>
              <p
                style={{ color: '#fff' }}
                className='card-text text-center pb-2'
              >
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor
                numquam quas mollitia possimus sequi. Enim sunt ea fugiat
                doloremque laboriosam harum neque ab! Possimus sed fugit nisi
                ullam consequatur architecto.
              </p>
            </div>
          </div>
        </div>
      </Slider>
      {/* <a className='carousel-control-prev' href='#slidee' data-slide='prev'>
        <span className='carousel-control-prev-icon' />
      </a>
      <a className='carousel-control-next' href='#slidee' data-slide='next'>
        <span className='carousel-control-next-icon' />
      </a> */}
    </div>
  );
}
