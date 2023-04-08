import React, { useState, useRef } from 'react';
import ProductSlider from './ProductSlider';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './CustomSlick.css';

export default function HomeProductSlider({ products }) {
  const [slickState, setSlickState] = useState({
    slideIndex: 0,
    updateCount: 0,
  });

  let settings = {
    dots: false,
    autoplay: true,
    autoplaySpeed: 5000,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (current, next) =>
      setSlickState({ ...setSlickState, slideIndex: next }),
    afterChange: () => {
      setSlickState({ ...slickState, updateCount: slickState.updateCount + 1 });
    },
  };

  const ref = useRef();

  // sort product
  let mostView = [...products].sort((a, b) => b.view - a.view).slice(0, 4);
  let bestPrice = [...products].sort((a, b) => a.price - b.price).slice(0, 4);
  let bestSeller = [...products]
    ?.sort((a, b) => a.quantity - a.sold - (b.quantity - b.sold))
    .slice(0, 4);

  return (
    <div className='container' style={{ marginTop: '3rem' }}>
      <div className='row'>
        <div className='col-md-12 col-lg-12'>
          <div className='text-center' style={{ marginBottom: '2rem' }}>
            <ul className='nav justify-content-center nav-pills'>
              <li
                className='nav-item section-link'
                onClick={() => ref.current.slickGoTo(0)}
              >
                <a href='#slides' className='nav-link text-uppercase'>
                  bán chạy
                </a>
              </li>
              <li
                className='nav-item section-link'
                onClick={() => ref.current.slickGoTo(1)}
              >
                <a href='#slides' className='nav-link text-uppercase'>
                  nổi bật
                </a>
              </li>
              <li
                className='nav-item section-link'
                onClick={() => ref.current.slickGoTo(2)}
              >
                <a href='#slides' className='nav-link text-uppercase'>
                  giá tốt
                </a>
              </li>
            </ul>
          </div>

          <Slider ref={ref} {...settings}>
            <ProductSlider products={bestSeller} />
            <ProductSlider products={mostView} />
            <ProductSlider products={bestPrice} />
          </Slider>
        </div>
      </div>
    </div>
  );
}
