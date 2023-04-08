import React from 'react';

export default function HomeBox() {
  return (
    <div className='d-flex justify-content-sm-center'>
      <div className='row text-center'>
        <div className='col-md-4 col-sm-11 col-lg-4 d-none d-md-block'>
          <div
            className='section-box rounded shadow'
            style={{
              backgroundColor: 'rgb(255,255,255)',
              padding: '30px 20px 30px 20px',
              margin: '-30px 0px 0px 0px',
              maxWidth: '370px',
            }}
          >
            <div className='icon-box featured-box icon-box-center text-center'>
              <div className='icon-center' style={{ marginBottom: '10px' }}>
                <i className='fas fa-truck' style={{ fontSize: '2.5em' }} />
              </div>
              <div className='icon-box-text'>
                <h4 className='text-uppercase'>freeship</h4>
                <p className='mt-3'>
                  facere impedit soluta necessitatibus provident nihil?
                  Laboriosam, impedit labore!
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-4 col-sm-11 col-lg-4 d-none d-md-block'>
          <div
            className='section-box section-box rounded shadow'
            style={{
              backgroundColor: 'rgb(255,255,255)',
              padding: '30px 20px 30px 20px',
              margin: '-30px 0px 0px 0px',
              maxWidth: '370px',
            }}
          >
            <div className='icon-box featured-box icon-box-center text-center'>
              <div className='icon-center' style={{ marginBottom: '10px' }}>
                <i
                  className='fas fa-cart-arrow-down'
                  style={{ fontSize: '2.5em' }}
                />
              </div>
              <div className='icon-box-text'>
                <h4 className='text-uppercase'>hoàn tiền 100%</h4>
                <p className='mt-3'>
                  facere impedit soluta necessitatibus provident nihil?
                  Laboriosam, impedit labore!
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-4 col-sm-11 col-lg-4 d-none d-md-block'>
          <div
            className='section-box rounded shadow'
            style={{
              backgroundColor: 'rgb(255,255,255)',
              padding: '30px 20px 30px 20px',
              margin: '-30px 0px 0px 0px',
              maxWidth: '370px',
            }}
          >
            <div className='icon-box featured-box icon-box-center text-center'>
              <div className='icon-center' style={{ marginBottom: '10px' }}>
                <i
                  className='fas fa-comment-dots'
                  style={{ fontSize: '2.5em' }}
                />
              </div>
              <div className='icon-box-text'>
                <h4 className='text-uppercase'>hỗ trợ 24/7</h4>
                <p className='mt-3'>
                  facere impedit soluta necessitatibus provident nihil?
                  Laboriosam, impedit labore!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
