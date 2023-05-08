import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  apiURL,
  LOCAL_STORAGE_ACCESS_TOKEN_EMPLOYEE,
} from '../../../../contexts/constants';
import moment from 'moment';
import { TRANSFERED, TRANSFERING } from '../../../constant/constants';
import { useReactToPrint } from 'react-to-print';
import { WarrantyPrint } from './WarrantyPrint';

import('./Transfered.css');

export default function Transfered() {
  // get warranty data
  const [trigger, setTrigger] = useState(false);
  const [warranties, setWarranties] = useState([]);
  useEffect(() => {
    axios
      .get(`${apiURL}/warranty`)
      .then((res) =>
        setWarranties(
          res.data.warranties.filter((warr) => warr.status === TRANSFERED),
        ),
      )
      .catch((err) => console.log(err));
  }, [trigger]);

  // handleSubmit
  const handleSubmit = async (billId, warranty) => {
    setAlertId(billId);
    try {
      const accessToken = localStorage.getItem(
        LOCAL_STORAGE_ACCESS_TOKEN_EMPLOYEE,
      );
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
      };

      const response = await axios.put(
        `${apiURL}/warranty/update/transfered/${warranty._id}`,
        {},
        { headers: headers },
      );

      if (response.data.success) {
        setAlertSuccess(`Đơn hành đã được cập nhật thành công`);
        handlePrint(warranty);
      }
    } catch (error) {
      console.log(error);
      setAlertFalse('Không thể cập nhật đơn hàng, vui lòng thử lại sau');
    }
  };

  // handle search
  const [search, setSearch] = useState('');
  const handleSearch = (e) => {
    setSearch(e.target.value);
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

  // Printing
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTittle: 'Warranty Report',
  });

  // crop product name
  const truncate = (e) => {
    return e.length > 55 ? e.substring(0, 40) + '...' : e;
  };

  return (
    <>
      <div className='warranty-receive-container'>
        <div className='warranty-receive-header'>Danh sách sản phẩm đã về</div>

        {warranties.length === 0 ? (
          <div className='warranty-empty'>
            <i class='fas fa-box-open'></i>
            Tạm thời không có đơn hàng nào đã về
          </div>
        ) : (
          <>
            <div className='d-flex justify-content-center'>
              <div className='warranty-search'>
                <input
                  onChange={(e) => handleSearch(e)}
                  type='text'
                  value={search}
                  placeholder='Nhập mã đơn hàng'
                />
                <i class='fas fa-search'></i>
              </div>
            </div>

            {warranties
              .filter((warr) =>
                search !== ''
                  ? warr.bill.bill_code?.toString().toLowerCase() ===
                    search?.toString().toLowerCase()
                  : warr,
              )
              .map((warr, index) => {
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
                      <div className='wci-info border-0 flex-column'>
                        <div className='wci-info-header'>
                          Thông tin khách hàng
                        </div>
                        <div className='mt-2 pl-4'>
                          <div className='wci-bill'>
                            Mã đơn hàng: {warr.bill.bill_code}
                          </div>
                          <div className='wci-name'>
                            Khách hàng: {warr.bill.customer.receiver}
                          </div>
                          <div className='wci-phone'>
                            Số điện thoại: {warr.bill.customer.phone_number}
                          </div>
                          <div className='wci-email'>
                            Email: {warr.bill.customer.customer_id.username}
                          </div>
                          <div className='wci-address'>
                            Địa chỉ: {warr.bill.customer.address}
                          </div>
                        </div>
                      </div>

                      <div className='wci-detail-container'>
                        <div className='wci-detail-header'>
                          Thông tin bảo hành
                        </div>

                        {warr.warranty_list.map((wItem) => {
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
                                      <>
                                        <div className='wci-warranty-list-detail'>
                                          <p className='m-0'>
                                            Danh mục bảo hành:{' '}
                                            {wItem.warranty_category.name} -{' '}
                                            {wItem.warranty_pursuit.name}
                                          </p>
                                        </div>

                                        <div className='d-flex'>
                                          <div className='wci-check'>
                                            Ngày gửi hàng:{' '}
                                            {moment(warr.createAt).format(
                                              'DD/MM/YYYY',
                                            )}
                                          </div>
                                          <div className='wci-check ml-2'>
                                            Ngày nhận hàng:{' '}
                                            {moment(
                                              wItem.date_receiving,
                                            ).format('DD/MM/YYYY')}
                                          </div>
                                        </div>
                                      </>
                                    ) : (
                                      ''
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className='warranty-receive-button-container mt-4 mb-2'>
                      <div
                        onClick={() => handleSubmit(warr.bill._id, warr)}
                        className='warranty-receive-button'
                      >
                        Bàn giao sản phẩm
                      </div>
                    </div>
                    <div style={{ display: 'none' }}>
                      <WarrantyPrint ref={componentRef} printData={warr} />
                    </div>
                  </div>
                );
              })}
          </>
        )}
      </div>
    </>
  );
}
