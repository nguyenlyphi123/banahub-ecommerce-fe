import React from 'react';
import { Link } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { setType } from '../../../../redux/reducers/typeSlice';

export default function ProductSlider({ products }) {
  // redux
  const dispatch = useDispatch();

  // crop product name
  const truncate = (e) => {
    return e.length > 45 ? e.substring(0, 35) + '...' : e;
  };
  const formatter = new Intl.NumberFormat('en');

  return (
    <>
      <div className='row mb-3'>
        {products.map((item, index) => {
          return (
            <div className='col-md-3'>
              <Link
                onClick={() => dispatch(setType(item.type))}
                key={index}
                to={`/store/product/${item._id}`}
                state={{ product: item }}
                className='item-link d-flex justify-content-center align-items-center'
              >
                <div
                  className='card border-0'
                  style={{ maxWidth: '216px', height: '310px' }}
                >
                  <img className='card-img-top' src={item.image} alt='' />
                  <div className='card-body'>
                    <h6 className='card-title text-uppercase'>
                      {truncate(item.name)}
                    </h6>
                    <p className='card-text' style={{ color: '#be9329' }}>
                      {formatter.format(item.price)} VNĐ
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
