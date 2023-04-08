import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import moment from 'moment';
import { AuthContext } from '../../../../contexts/AuthContext';

import Prepare from '../prepare-invoice/Prepare';

import {
  apiURL,
  LOCAL_STORAGE_ACCESS_TOKEN_EMPLOYEE,
} from '../../../../contexts/constants';
import './Processing.css';
import { AWAITING } from '../../../constant/constants';

export default function Processing() {
  // trigger
  const [trigger, setTrigger] = useState(false);

  // get bill data
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    try {
      axios
        .get(`${apiURL}/bill`)
        .then((res) =>
          setInvoices(
            res.data.bills
              .filter((item) => item.status === AWAITING)
              .sort((a, b) => Date.parse(b.createAt) - Date.parse(a.createAt)),
          ),
        )
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  }, [trigger]);

  // get responsible_staff
  const {
    authState: { employee },
  } = useContext(AuthContext);

  // handleSubmit
  const handleSubmit = async (bill_id) => {
    const accessToken = localStorage.getItem(
      LOCAL_STORAGE_ACCESS_TOKEN_EMPLOYEE,
    );
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
    };

    console.log(accessToken);

    try {
      const response = await axios.post(
        `${apiURL}/invoice-requirement/create`,
        {
          bill_id: bill_id,
          responsible_staff: employee.info._id,
        },
        {
          headers: headers,
        },
      );

      if (response.data.success) {
        setAlertSuccess(
          'Xác nhận đơn hàng thành công. Đơn hàng đang được chuẩn bị.',
          bill_id,
        );
      }
    } catch (error) {
      setAlertFalse('Không thể xác nhận đơn hàng.', bill_id);
    }
  };

  // popup alert
  const [message, setMessage] = useState('');
  const [isPopup, setIsPopup] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [popupId, setPopupId] = useState('');

  const SuccessAlert = () => {
    return (
      <div className='alert alert-success alert-dismissible'>
        <button
          onClick={() => {
            handleResetAlert();
            setTrigger(!trigger);
          }}
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

  const setAlertSuccess = (message, id) => {
    setIsPopup(true);
    setIsSuccess(true);
    setMessage(message);
    setPopupId(id);
  };

  const setAlertFalse = (message, id) => {
    setIsPopup(true);
    setIsSuccess(false);
    setMessage(message);
    setPopupId(id);
  };

  const handleResetAlert = () => {
    setIsPopup(false);
    setIsSuccess(false);
    setMessage('');
    setPopupId('');
  };

  // Convert number
  const formatter = new Intl.NumberFormat('en');

  return (
    <>
      {invoices.length > 0 ? (
        invoices?.map((item, index) => {
          return (
            <div key={index} className='invoice-process-container'>
              {isPopup
                ? popupId === item._id
                  ? isSuccess
                    ? SuccessAlert()
                    : DangerAlert()
                  : ''
                : ''}

              <div className='ip-customer d-flex justify-content-between'>
                <div>Khách hàng: {item.customer.name}</div>
                <div>
                  Ngày đặt:
                  <Moment className='ml-2' format='DD/MM/YYYY'>
                    {item.createAt}
                  </Moment>
                </div>
              </div>

              <div className='ip-product-container'>
                {item.cart_list.map((cart) => {
                  return (
                    <div className='ip-product'>
                      <div className='product-image'>
                        <img
                          src={cart.product.image}
                          alt=''
                          style={{ width: '80px' }}
                        />
                      </div>
                      <div
                        key={cart.product._id}
                        className='product-detail d-flex justify-content-between align-items-center w-100 ml-2'
                      >
                        <div className='product-name d-flex flex-column '>
                          {cart.product.name}{' '}
                          <p className='ml-1 mb-0' style={{ color: 'red' }}>
                            {' '}
                            x {cart.quantity}
                          </p>
                        </div>

                        <div className='product-price'>
                          {formatter.format(cart.product.price)} VNĐ
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className='ip-prepare'>
                <div className='prepare-total-price text-end'>
                  <span style={{ color: 'black' }}>Thành tiền: </span>
                  {formatter.format(item.last_cost)} VNĐ
                </div>

                <div className='prepare-container d-flex justify-content-between align-items-center'>
                  <div className='prepare-content'>
                    Xin vui lòng nhấn "Sắp xếp đơn hàng" để sắp xếp nhân viên
                    chuẩn bị cho đơn hàng.
                  </div>
                  <div
                    onClick={() => handleSubmit(item._id)}
                    // to='prepare'
                    // state={{ invoice: item }}
                    className='prepare-btn'
                  >
                    Xác nhận đơn hàng
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className='invoice-empty'>
          <i class='fas fa-box-open'></i>
          Tạm thời không có đơn hàng
        </div>
      )}
    </>
  );
}
