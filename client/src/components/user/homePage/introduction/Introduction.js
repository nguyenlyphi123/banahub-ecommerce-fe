import React from 'react';
import { Link } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { setType } from '../../../../redux/reducers/typeSlice';

export default function Introduction({ products }) {
  // redux
  const dispatch = useDispatch();

  // crop product name
  const truncate = (e) => {
    return e.length > 45 ? e.substring(0, 35) + '...' : e;
  };
  const formatter = new Intl.NumberFormat('en');

  return (
    <>
      {products.map((item) => {
        return (
          <Link
            onClick={() => dispatch(setType(item.type))}
            to={`/store/product/${item._id}`}
            className='item-link'
            state={{ product: item }}
          >
            <div className='sub-item text-center d-flex flex-row'>
              <img
                src={item.image}
                alt=''
                style={{ width: '100px', height: '100px' }}
              />
              <div className='item-context'>
                <p
                  className='text-uppercase'
                  style={{ fontWeight: 500, marginBottom: '0 !important' }}
                >
                  {truncate(item.name)}
                </p>
                <p style={{ color: '#be9329' }}>
                  {formatter.format(item.price)} VNĐ
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </>
  );
}
