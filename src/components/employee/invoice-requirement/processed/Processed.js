import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import Moment from 'react-moment';
import { useReactToPrint } from 'react-to-print';

import { apiURL } from '../../../../contexts/constants';
import '../processing/Processing.css';
import {
  AWAITING,
  COMPLETE,
  DELIVERING,
  EXPORTING,
  INSTALLED,
  INSTALLING,
  PREPARING,
} from '../../../constant/constants';

export default function Processed() {
  // get bill data
  const [trigger, setTrigger] = useState(false);

  const [bill, setBill] = useState([]);

  useEffect(() => {
    try {
      axios
        .get(`${apiURL}/bill`)
        .then((res) =>
          setBill(
            res.data.bills
              .filter((item) => item.status === PREPARING)
              .sort((a, b) => Date.parse(b.createAt) - Date.parse(a.createAt)),
          ),
        )
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  }, [trigger]);

  // get invoices
  const [invoices, setInvoices] = useState([]);
  const [billValid, setBillValid] = useState([]);

  useEffect(() => {
    try {
      axios
        .get(`${apiURL}/invoice-requirement`)
        .then((res) => {
          setInvoices(
            res.data.invoices?.filter(
              (inv) =>
                inv.status === EXPORTING ||
                inv.status === INSTALLING ||
                inv.status === INSTALLED,
            ),
          );
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  }, [trigger]);

  // handle finish
  const handleFinish = async (invoice_id, bill_id) => {
    setAlertId(bill_id);

    try {
      const response = await axios.put(
        `${apiURL}/invoice-requirement/update/${invoice_id}/complete`,
      );

      if (response.data.success) {
        setAlertSuccess('Đã hoàn thành đơn hàng.');
      }
    } catch (error) {
      setAlertFalse('Không thể hoàn thành đơn hàng. Xin vui lòng thử lại sau.');
    }
  };

  // popup alert
  const [message, setMessage] = useState('');
  const [isPopup, setIsPopup] = useState(false);
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

  // Convert number
  const formatter = new Intl.NumberFormat('en');

  return (
    <>
      {invoices.length > 0 ? (
        bill?.map((item, index) => {
          return (
            <div key={index} className='invoice-process-container'>
              {isPopup
                ? alertId === item._id
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
                    {invoices?.map((invoice) => {
                      if (invoice.bill_id.includes(item._id))
                        if (invoice.engineering_staff && invoice.export_staff)
                          return (
                            <>
                              <div className='employee'>
                                Nhân viên xuất kho: {invoice.export_staff.name}
                              </div>

                              <div className='employee'>
                                Nhân viên kỹ thuật:{' '}
                                {invoice.engineering_staff.name}
                              </div>
                            </>
                          );
                        else
                          return (
                            <div>Đơn hàng đang trong quá trình chuẩn bị</div>
                          );
                    })}
                  </div>
                  {invoices.map((inv) => {
                    if (inv.bill_id.includes(item._id))
                      switch (inv.status) {
                        case EXPORTING:
                          return (
                            <div
                              className='prepare-btn'
                              style={{ cursor: 'not-allowed' }}
                            >
                              Đang chuẩn bị hàng
                            </div>
                          );

                        case INSTALLING:
                          return (
                            <div
                              className='prepare-btn'
                              style={{ cursor: 'not-allowed' }}
                            >
                              Đang lắp ráp
                            </div>
                          );

                        case INSTALLED:
                          return (
                            <div
                              onClick={() => {
                                handleFinish(inv._id, item._id);
                              }}
                              className='prepare-btn'
                            >
                              Hoàn thành đơn hàng
                            </div>
                          );

                        default:
                          break;
                      }
                  })}
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
