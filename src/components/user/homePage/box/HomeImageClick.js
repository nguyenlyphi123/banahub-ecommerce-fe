import React from 'react';
import { Link } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { typeSelector } from '../../../../redux/reducers/typeSlice';

export default function HomeImageClick() {
  // redux
  const type = useSelector(typeSelector);

  return (
    <div
      className='text-center d-none d-md-block'
      style={{ marginTop: '3rem' }}
    >
      <div className='row'>
        <div className='col-sm-12 col-md-12 col-lg-8'>
          <div className='zoom rounded'>
            <Link to={`/store/${type.name}`}>
              <img
                className='rounded img-fluid'
                src='https://firebasestorage.googleapis.com/v0/b/salemanager-11c9a.appspot.com/o/images%2Fslide6.png?alt=media&token=ed10a757-80b2-4340-9c82-f1ec7cbaccb5'
                alt=''
              />
            </Link>
          </div>
        </div>
        <div className='col-lg-4 d-flex flex-column'>
          <div
            className='p-2 zoom'
            style={{ transform: 'translateY(-0.5rem)' }}
          >
            <div className='zoom rounded'>
              <Link to={`/store/${type.name}`}>
                <img
                  className='rounded img-fluid d-none d-lg-block'
                  src='https://firebasestorage.googleapis.com/v0/b/salemanager-11c9a.appspot.com/o/images%2Fslide1.png?alt=media&token=1d541428-6ae7-40e6-9572-dd833e04798b'
                  alt=''
                />
              </Link>
            </div>
          </div>
          <div className='mt-1' />
          <div className='p-2' style={{ transform: 'translateY(-0.5rem)' }}>
            <div className='zoom rounded'>
              <Link to={`/store/${type.name}`}>
                <img
                  className='rounded img-fluid d-none d-lg-block'
                  src='https://firebasestorage.googleapis.com/v0/b/salemanager-11c9a.appspot.com/o/images%2Fslide7.jpg?alt=media&token=6c40b430-a4c7-41fa-864c-5d12abaaeda8'
                  alt=''
                />
              </Link>
            </div>
          </div>
        </div>
        <div
          className='col-sm-12 col-md-12 col-lg-12'
          style={{ marginTop: '12px' }}
        >
          <div className='zoom rounded'>
            <Link to={`/store/${type.name}`}>
              <img
                className='rounded img-fluid'
                src='https://firebasestorage.googleapis.com/v0/b/salemanager-11c9a.appspot.com/o/images%2Fslide1.png?alt=media&token=1d541428-6ae7-40e6-9572-dd833e04798b'
                alt=''
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
