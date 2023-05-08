import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  apiURL,
  LOCAL_STORAGE_ACCESS_TOKEN_EMPLOYEE,
} from '../../../../contexts/constants';
import moment from 'moment';
import { TRANSFERED, TRANSFERING } from '../../../constant/constants';

// import('./Receiving.css');

export default function Transfering() {
  // get warranty data
  const [trigger, setTrigger] = useState(false);
  const [warranties, setWarranties] = useState([]);
  useEffect(() => {
    axios
      .get(`${apiURL}/warranty`)
      .then((res) =>
        setWarranties(
          res.data.warranties.filter((warr) => warr.status === TRANSFERING),
        ),
      )
      .catch((err) => console.log(err));
  }, [trigger]);

  // calc date end
  const getDuration = (date, timestamp) => {
    const orderDate = moment(date);
    const endDate = orderDate.add(timestamp, 'days');
    return moment(endDate).format('DD/MM/YYYY');
  };

  // handleUpdateStatus
  const handleUpdateStatus = async (warrantyId, billId, product) => {
    setAlertId(billId);
    try {
      const accessToken = localStorage.getItem(
        LOCAL_STORAGE_ACCESS_TOKEN_EMPLOYEE,
      );
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
      };

      const response = await axios.put(
        `${apiURL}/warranty/update/wl/s/${warrantyId}`,
        {
          product: product._id,
        },
        { headers: headers },
      );

      if (response.data.success) {
        setAlertSuccess(
          `Đã xác nhận sản phẩm "${truncate(product.name)}" đã về hàng`,
        );
      }
    } catch (error) {
      console.log(error);
      setAlertFalse('Server đang bận, vui lòng thử lại sau');
    }
  };

  // handleSubmit
  const handleSubmit = async (billId, warrantyId) => {
    setAlertId(billId);
    try {
      const accessToken = localStorage.getItem(
        LOCAL_STORAGE_ACCESS_TOKEN_EMPLOYEE,
      );
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
      };

      const response = await axios.put(
        `${apiURL}/warranty/update/transfering/${warrantyId}`,
        {},
        { headers: headers },
      );

      if (response.data.success) {
        setAlertSuccess(`Đơn hành đã được cập nhật thành công`);
      }
    } catch (error) {
      console.log(error);
      setAlertFalse('Không thể cập nhật đơn hàng, vui lòng thử lại sau');
    }
  };

  // popup alert
  const [message, setMessage] = useState('');
  const [isAlert, setIsAlert] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [alertId, setAlertId] = useState('');

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

  const setAlertSuccess = (message) => {
    setIsAlert(true);
    setIsSuccess(true);
    setMessage(message);
  };

  const setAlertFalse = (message) => {
    setIsAlert(true);
    setIsSuccess(false);
    setMessage(message);
  };

  const handleResetAlert = () => {
    setIsAlert(false);
    setIsSuccess(false);
    setMessage('');
  };

  // crop product name
  const truncate = (e) => {
    return e.length > 55 ? e.substring(0, 40) + '...' : e;
  };

  return (
    <>
      <div className='warranty-receive-container'>
        <div className='warranty-receive-header'>Danh sách vận chuyển</div>

        {warranties.length === 0 ? (
          <div className='warranty-empty'>
            <i class='fas fa-box-open'></i>
            Tạm thời không có đơn hàng chờ vận chuyển
          </div>
        ) : (
          warranties.map((warr, index) => {
            return (
              <div key={index} className='warranty-check-list'>
                {isAlert
                  ? alertId === warr.bill._id
                    ? isSuccess
                      ? SuccessAlert()
                      : DangerAlert()
                    : ''
                  : ''}

                <div className='warranty-check-item'>
                  <div className='wci-info'>
                    <div className='wci-customer'>
                      Khách hàng: {warr.bill.customer.name}
                    </div>

                    <div className='wci-date'>
                      Ngày bảo hành:{' '}
                      {moment(warr.createAt).format('DD/MM/YYYY')}
                    </div>
                  </div>

                  {warr.warranty_list.map((wItem) => {
                    const expirationDate = getDuration(
                      warr.createAt,
                      wItem.expected_duration,
                    );

                    return (
                      <div className='wci-detail'>
                        <div className='wci-product'>
                          <div className='wci-product-info'>
                            <div className='image'>
                              <img src={wItem.product.image} alt='' />
                            </div>
                            <div className='name'>
                              <p className='m-0'>{wItem.product.name}</p>
                              {wItem.status === TRANSFERED ? (
                                <div className='wci-check'>
                                  Nhận hàng ngày:{' '}
                                  {moment(wItem.date_receiving).format(
                                    'DD/MM/YYYY',
                                  )}
                                </div>
                              ) : (
                                <div className='wci-check'>
                                  Ngày dự kiến nhận hàng:{' '}
                                  {expirationDate || 'N/A'}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className='wci-product-check'>
                            {warr.warranty_list.find(
                              (item) =>
                                item.product === wItem.product._id &&
                                item.status === TRANSFERED,
                            ) ? (
                              <div className='wci-button'>
                                Sản phẩm đã được nhận
                              </div>
                            ) : (
                              <div
                                onClick={() =>
                                  handleUpdateStatus(
                                    warr._id,
                                    warr.bill._id,
                                    wItem.product,
                                  )
                                }
                                className='wci-button'
                              >
                                Đã nhận được hàng
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className='warranty-receive-button-container mt-4 mb-2'>
                  {warr.warranty_list.find(
                    (item) => item.status === TRANSFERING,
                  ) ? (
                    <div className='warranty-receive-button disable'>
                      Tất cả sản phẩm đã về hàng
                    </div>
                  ) : (
                    <div
                      onClick={() => handleSubmit(warr.bill._id, warr._id)}
                      className='warranty-receive-button'
                    >
                      Tất cả sản phẩm đã về hàng
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
