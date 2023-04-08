import React from 'react';
import { Link } from 'react-router-dom';

import('./BlankPage.css');

export default function BlankPage() {
  return (
    <>
      <div className='full-page-wrapper page-body-wrapper'>
        <div className='text-center error-page bg-primary d-flex justify-content-center align-items-center'>
          <div className='row flex-grow'>
            <div className='col-lg-7 mx-auto text-white'>
              <div className='row align-items-center d-flex flex-row'>
                <div className='col-lg-12 text-lg-center'>
                  <h1 className='display-1 mb-0'>404</h1>
                </div>
                <div className='col-lg-12 error-page-divider text-lg-left p-0'>
                  <h2 className='text-center'>SORRY!</h2>
                  <h3 className='font-weight-light'>
                    The page you're looking was not found
                  </h3>
                </div>
              </div>
              <div className='row mt-5'>
                <div className='col-12 text-center mt-xl-2'>
                  <Link className='text-white font-weight-medium' to='/'>
                    Back to home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* content-wrapper ends */}
      </div>
      {/* page-body-wrapper ends */}
    </>
  );
}
