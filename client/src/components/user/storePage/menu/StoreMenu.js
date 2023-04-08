import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setType } from '../../../../redux/reducers/typeSlice';

export default function StoreMenu({
  handleChangeLTypeId,
  handleChangeBrandId,
}) {
  // redux
  const dispatch = useDispatch();

  const handleSetType = (typeId) => {
    dispatch(setType(typeId));
  };

  // fetch data
  const [typeList, setTypeList] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:6001/api/type')
      .then((res) => {
        setTypeList(res.data.types);
      })
      .catch((err) => console.log(err));
  }, []);

  // declare navigate
  const navigate = useNavigate();

  // set typeId for StoreRecommend and StoreProduct, then navigate URL
  const handleTypeListClick = (typeId) => {
    handleSetType(typeId);
    handleChangeLTypeId('');
    handleChangeBrandId('');
  };

  return (
    <>
      <div className='list-group'>
        <h5
          className='text-center mb-2'
          style={{ color: '#be9329', fontWeight: 500, fontSize: '1.4em' }}
        >
          DANH MỤC SẢN PHẨM
        </h5>

        {typeList.map((item, index) => {
          return (
            <Link
              onClick={() => handleTypeListClick(item)}
              to={'/store/' + item.name}
              key={index}
              className='list-group-item list-group-item-action d-flex align-items-center pt-2 pb-2'
            >
              <img
                className='mr-3'
                src={item.icon_link}
                alt=''
                style={{ width: '24px', height: '24px' }}
              />
              {item.name}
            </Link>
          );
        })}
      </div>
    </>
  );
}
