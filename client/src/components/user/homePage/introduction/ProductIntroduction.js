import React from 'react';
import Introduction from './Introduction';
import './ProductIntroduction.css';

export default function ProductIntroduction({ products }) {
  // sort product
  let laptops = [...products]
    .filter((item) => {
      return item.type.name.toString().includes('Laptop');
    })
    .slice(0, 5);
  let cpus = [...products]
    .filter((item) => {
      return item.type.name.toString().includes('Linh kiện máy tính');
    })
    .slice(0, 5);
  let screens = [...products]
    .filter((item) => {
      return item.type.name.toString().includes('Màn hình máy tính');
    })
    .slice(0, 5);
  let accessories = [...products]
    .filter((item) => {
      return item.type.name.toString().includes('Phụ kiện máy tính');
    })
    .slice(0, 5);

  return (
    <div
      className='container-fluid container-center'
      style={{ marginTop: '3rem' }}
    >
      <div className='sub-container' style={{ width: '80%' }}>
        <div className='row'>
          <div className='col-sm-12 col-md-4 col-lg-3'>
            <div>
              <p
                className='text-uppercase text-center pb-2'
                style={{
                  fontWeight: 'bold',
                  fontSize: '1.5em',
                  color: '#be9329',
                }}
              >
                màn hình
              </p>
            </div>
            <div className='list-item'>
              <Introduction products={screens} />
            </div>
          </div>
          <div className='col-sm-12 col-md-4 col-lg-3'>
            <div>
              <p
                className='text-uppercase text-center pb-2'
                style={{
                  fontWeight: 'bold',
                  fontSize: '1.5em',
                  color: '#be9329',
                }}
              >
                linh kiện
              </p>
            </div>
            <div className='list-item'>
              <Introduction products={cpus} />
            </div>
          </div>
          <div className='col-sm-12 col-md-4 col-lg-3'>
            <div>
              <p
                className='text-uppercase text-center pb-2'
                style={{
                  fontWeight: 'bold',
                  fontSize: '1.5em',
                  color: '#be9329',
                }}
              >
                phụ kiện
              </p>
            </div>
            <div className='list-item'>
              <Introduction products={accessories} />
            </div>
          </div>
          <div className='col-sm-12 col-md-4 col-lg-3'>
            <div>
              <p
                className='text-uppercase text-center pb-2'
                style={{
                  fontWeight: 'bold',
                  fontSize: '1.5em',
                  color: '#be9329',
                }}
              >
                laptop
              </p>
            </div>
            <div className='list-item'>
              <Introduction products={laptops} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
