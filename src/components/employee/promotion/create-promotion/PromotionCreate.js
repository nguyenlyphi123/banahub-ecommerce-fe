import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import {
  apiURL,
  LOCAL_STORAGE_ACCESS_TOKEN_EMPLOYEE,
} from '../../../../contexts/constants';
import('./PromotionCreate.css');

export default function PromotionCreate() {
  // customer rank
  const [customerRankHeader, setCustomerRankHeader] = useState('Nhấn để chọn');
  const [customerRank, setCustomerRank] = useState([]);
  useEffect(() => {
    try {
      axios
        .get(`${apiURL}/customer_rank`)
        .then((res) => setCustomerRank(res.data.customerRank))
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  }, []);

  // promotion input
  const [promotionData, setPromotionData] = useState({});

  const handleSetPromotionData = (e) => {
    setPromotionData({ ...promotionData, [e.target.name]: e.target.value });
  };

  // prmotion submit
  const handlePromotionSubmit = async () => {
    const accessToken = localStorage.getItem(
      LOCAL_STORAGE_ACCESS_TOKEN_EMPLOYEE,
    );
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
    };

    if (
      !promotionData.name ||
      !promotionData.rank ||
      !promotionData.start ||
      !promotionData.end ||
      !promotionData.quantity
    ) {
      setAlertFalse('Cần điền tất cả các trường');
      return;
    }

    try {
      const response = await axios.post(
        `${apiURL}/promotion/create`,
        {
          name: promotionData.name,
          promotion_percent: parseInt(promotionData.promotion_percent),
          rank: promotionData.rank,
          start: moment(promotionData.start).format(),
          end: moment(promotionData.end).format(),
          quantity: parseInt(promotionData.quantity),
        },
        {
          headers: headers,
        },
      );

      if (response.data.success) {
        setAlertSuccess('Tạo chương trình khuyến mãi thành công');
      }
    } catch (error) {
      setAlertFalse('Không thể tạo chương trình khuyến mãi');
    }
  };

  // popup alert
  const [message, setMessage] = useState('');
  const [isPopup, setIsPopup] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const SuccessAlert = () => {
    return (
      <div className='alert alert-success alert-dismissible'>
        <button
          onClick={handleResetAlert}
          type='button'
          className='close'
          data-dismiss='alert'
        >
          &times;
        </button>
        <strong>Success!</strong> {message}
      </div>
    );
  };

  const DangerAlert = () => {
    return (
      <div className='alert alert-danger alert-dismissible'>
        <button
          onClick={handleResetAlert}
          type='button'
          className='close'
          data-dismiss='alert'
        >
          &times;
        </button>
        <strong>Warning!</strong> {message}
      </div>
    );
  };

  const setAlertSuccess = (message) => {
    setIsPopup(true);
    setIsSuccess(true);
    setMessage(message);
    setPromotionData({});
  };

  const setAlertFalse = (message) => {
    setIsPopup(true);
    setIsSuccess(false);
    setMessage(message);
  };

  const handleResetAlert = () => {
    setIsPopup(false);
    setIsSuccess(false);
    setMessage('');
  };

  return (
    <>
      <div className='promotion-new-container'>
        <div className='prn-header'>Tạo khuyến mãi mới</div>
        <div className='prn-detail-container'>
          {isPopup ? (isSuccess ? SuccessAlert() : DangerAlert()) : ''}
          <div className='pnd-type d-flex'>
            <div className='pnd-label d-flex align-items-center flex-row-reverse'>
              <p className='m-0'>Đối tượng khuyến mãi</p>
            </div>
            <div className='pnd-input-container border-0 pl-0'>
              <div className='dropdown'>
                <button
                  type='button'
                  className='btn pnd-dropdown-button dropdown-toggle'
                  data-toggle='dropdown'
                >
                  {customerRankHeader}
                </button>
                <div className='dropdown-menu pnd-dropdown-menu'>
                  {customerRank.map((item, index) => {
                    return (
                      <div
                        onClick={() => {
                          setPromotionData({
                            ...promotionData,
                            rank: item._id,
                          });
                          setCustomerRankHeader(item.name);
                        }}
                        name='rank'
                        key={index}
                        className='dropdown-item'
                      >
                        {item.name}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className='pnd-name d-flex'>
            <div className='pnd-label d-flex align-items-center flex-row-reverse'>
              <p className='m-0'>Tên chương trình</p>
            </div>
            <div className='pnd-input-container'>
              <input
                onChange={(e) => handleSetPromotionData(e)}
                type=''
                name='name'
                value={promotionData.name}
              />
            </div>
          </div>

          <div className='pnd-date d-flex'>
            <div className='pnd-label d-flex align-items-center flex-row-reverse'>
              <p className='m-0'>Thời gian sử dụng mã</p>
            </div>
            <div className='pnd-input-container mr-1'>
              <input
                onChange={(e) => handleSetPromotionData(e)}
                type='date'
                name='start'
                value={promotionData.start}
              />
            </div>
            <div className='pnd-input-container ml-1'>
              <input
                onChange={(e) => handleSetPromotionData(e)}
                type='date'
                name='end'
                value={promotionData.end}
              />
            </div>
          </div>

          <div className='pnd-discount d-flex'>
            <div className='pnd-label d-flex align-items-center flex-row-reverse'>
              <p className='m-0'>Mức giảm</p>
            </div>
            <div className='pnd-input-container'>
              <input
                onChange={(e) => handleSetPromotionData(e)}
                type='number'
                placeholder='Nhập vào phần trăm'
                min='0'
                max='100'
                name='promotion_percent'
              />
            </div>
          </div>

          <div className='pnd-quantity d-flex'>
            <div className='pnd-label d-flex align-items-center flex-row-reverse'>
              <p className='m-0'>Lượt sử dụng tối đa</p>
            </div>
            <div className='pnd-input-container'>
              <input
                onChange={(e) => handleSetPromotionData(e)}
                type='number'
                min='1'
                max='10000'
                placeholder='Nhập vào'
                name='quantity'
              />
            </div>
          </div>

          <div className='pnd-submit-container'>
            <Link to='/employee/promotion' className='btn pnd-cancel mr-2'>
              Thoát
            </Link>
            <div onClick={handlePromotionSubmit} className='btn pnd-button'>
              Xác nhận
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
