import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  apiURL,
  LOCAL_STORAGE_ACCESS_TOKEN_EMPLOYEE,
} from '../../../../contexts/constants';
import('../create-promotion/PromotionCreate.css');

export default function PromotionUpdate() {
  // location
  const location = useLocation();

  // customer rank
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
  const [promotionData, setPromotionData] = useState(location.state.promotion);

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

    try {
      const response = await axios.put(
        `${apiURL}/promotion/update/${promotionData._id}`,
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
        setAlertSuccess('Cập nhật khuyến mãi thành công');
      }
    } catch (error) {
      setAlertFalse('Cập nhật khuyến mãi thất bại');
    }
  };

  // promotion cancel
  const navigate = useNavigate();

  const handlePromotionCancel = async () => {
    const accessToken = localStorage.getItem(
      LOCAL_STORAGE_ACCESS_TOKEN_EMPLOYEE,
    );
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
    };

    try {
      const response = await axios.put(
        `${apiURL}/promotion/update/cancel/${promotionData._id}`,
        {},
        {
          headers: headers,
        },
      );

      if (response.data.success) {
        setAlertSuccess('Đã dừng chương trình khuyến mãi');
      }
    } catch (error) {
      console.log(error);
      setAlertFalse('Không thể dừng chương trình khuyến mãi');
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
        <div className='prn-header'>Chi tiết khuyến mãi</div>
        <div className='prn-detail-container'>
          {isPopup ? (isSuccess ? SuccessAlert() : DangerAlert()) : ''}
          {promotionData.status !== 'ENDED' ? (
            <>
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
                      {promotionData.rank.name}
                    </button>
                    <div className='dropdown-menu pnd-dropdown-menu'>
                      {customerRank.map((item, index) => {
                        return (
                          <div
                            onClick={() => {
                              setPromotionData({
                                ...promotionData,
                                rank: item.rank,
                              });
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
                    value={moment(promotionData.start).format('YYYY-MM-DD')}
                  />
                </div>
                <div className='pnd-input-container ml-1'>
                  <input
                    onChange={(e) => handleSetPromotionData(e)}
                    type='date'
                    name='end'
                    value={moment(promotionData.end).format('YYYY-MM-DD')}
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
                    value={promotionData.promotion_percent}
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
                    value={promotionData.quantity}
                    name='quantity'
                  />
                </div>
              </div>

              <div className='pnd-submit-container'>
                <Link to='/employee/promotion' className='btn pnd-cancel mr-2'>
                  Thoát
                </Link>
                <div
                  onClick={handlePromotionCancel}
                  className='btn btn-danger mr-2'
                >
                  Kết thúc ngay
                </div>
                <div onClick={handlePromotionSubmit} className='btn pnd-button'>
                  Cập nhật
                </div>
              </div>
            </>
          ) : (
            <>
              <div className='pnd-type d-flex'>
                <div className='pnd-label d-flex align-items-center flex-row-reverse'>
                  <p className='m-0'>Đối tượng khuyến mãi</p>
                </div>
                <div className='pnd-input-container border-0 pl-0'>
                  <div className='dropdown'>
                    <button type='button' className='btn pnd-dropdown-button'>
                      {promotionData.rank.name}
                    </button>
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
                    disabled
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
                    value={moment(promotionData.start).format('YYYY-MM-DD')}
                    disabled
                  />
                </div>
                <div className='pnd-input-container ml-1'>
                  <input
                    onChange={(e) => handleSetPromotionData(e)}
                    type='date'
                    name='end'
                    value={moment(promotionData.end).format('YYYY-MM-DD')}
                    disabled
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
                    value={promotionData.promotion_percent}
                    name='promotion_percent'
                    disabled
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
                    value={promotionData.quantity}
                    name='quantity'
                    disabled
                  />
                </div>
              </div>

              <div className='pnd-submit-container'>
                <Link to='/employee/promotion' className='btn pnd-cancel mr-2'>
                  Thoát
                </Link>
                <div
                  className='btn btn-dark mr-2'
                  style={{ cursor: 'not-allowed' }}
                >
                  Kết thúc ngay
                </div>
                <div className='btn btn-dark' style={{ cursor: 'not-allowed' }}>
                  Cập nhật
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
