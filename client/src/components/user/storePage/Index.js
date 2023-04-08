import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { typeSelector } from '../../../redux/reducers/typeSlice';

import StoreMenu from './menu/StoreMenu';
import StoreRecommend from './recommend/StoreRecommend';
import { Outlet } from 'react-router-dom';
import ScrollToTop from '../../../ScrollToTop';

export default function StorePage() {
  // redux
  const typeId = useSelector(typeSelector);

  // const [typeId, setTypeId] = useState('');
  const [ltypeId, setLTypeId] = useState('');
  const [brandId, setBrandId] = useState('');

  const handleChangeLTypeId = (ltypeId) => {
    setLTypeId(ltypeId);
  };

  const handleChangeBrandId = (brandId) => {
    setBrandId(brandId);
  };

  const formatter = new Intl.NumberFormat('en');

  return (
    <>
      <div className='container-fluid mt-5'>
        <div className='row'>
          <div className='col-lg-3 d-none d-md-block'>
            <StoreMenu
              handleChangeLTypeId={handleChangeLTypeId}
              handleChangeBrandId={handleChangeBrandId}
            />
            <StoreRecommend typeId={typeId._id} />
          </div>
          <div className='col-md-12 col-lg-9'>
            <div className='row' style={{ overflow: 'hidden' }}>
              <ScrollToTop />

              {/* <StoreProduct
                typeId={typeId}
                handleChangeTypeId={handleChangeTypeId}
                ltypeId={ltypeId}
                handleChangeLTypeId={handleChangeLTypeId}
                brandId={brandId}
                handleChangeBrandId={handleChangeBrandId}
              /> */}

              <Outlet
                context={{
                  typeId: typeId._id,
                  ltypeId,
                  handleChangeLTypeId,
                  brandId,
                  handleChangeBrandId,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
