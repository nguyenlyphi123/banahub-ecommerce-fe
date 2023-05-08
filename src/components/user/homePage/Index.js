import React, { useEffect, useState } from 'react';
import HomeSlider from './slider/HomeSlider';
import HomeBox from './box/HomeBox';
import HomeImageClick from './box/HomeImageClick';
import HomeProductSlider from './slider/HomeProductSlider';
import HomeRating from './rating/HomeRating';
import ProductIntroduction from './introduction/ProductIntroduction';
import axios from 'axios';

import { apiURL } from '../../../contexts/constants';

export default function HomePage() {
  // get product data
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios
      .get(`${apiURL}/product`)
      .then((res) => setProducts(res.data.products))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      {/* Slider */}
      <HomeSlider />

      {/* Main */}
      <div class='container-fluid d-flex justify-content-center'>
        <div className='sub-container' style={{ width: '80%' }}>
          <HomeBox />
          <HomeImageClick />
          <HomeProductSlider products={products} />
        </div>
      </div>

      <HomeRating />
      <ProductIntroduction products={products} />
    </>
  );
}
