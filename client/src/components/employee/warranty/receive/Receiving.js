import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  apiURL,
  LOCAL_STORAGE_ACCESS_TOKEN_EMPLOYEE,
} from '../../../../contexts/constants';
import moment from 'moment';

import('./Receiving.css');

export default function Receiving() {
  // get bill data
  const [bills, setBills] = useState([]);
  useEffect(() => {
    axios
      .get(`${apiURL}/bill`)
      .then((res) => setBills(res.data.bills))
      .catch((err) => console.log(err));
  }, []);

  // get warranty category data
  const [category, setCategory] = useState([]);
  useEffect(() => {
    axios
      .get(`${apiURL}/warranty-category`)
      .then((res) => setCategory(res.data.warranties))
      .catch((err) => console.log(err));
  }, []);

  // calc date end
  const getDuration = (typeId, date) => {
    const warranty = category.find((cate) => cate.type === typeId);

    if (warranty) {
      const orderDate = moment(date);
      const endDate = orderDate.add(warranty.duration, 'years');

      return moment(endDate).format('DD/MM/YYYY');
    }
  };

  // handle search
  const [search, setSearch] = useState();
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // handleSubmit
  const handleSubmit = async (billId, product) => {
    setAlertId(billId);
    try {
      const accessToken = localStorage.getItem(
        LOCAL_STORAGE_ACCESS_TOKEN_EMPLOYEE,
      );
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
      };

      const response = await axios.post(
        `${apiURL}/warranty/create`,
        {
          bill: billId,
          warranty_list: [
            {
              product: product._id,
            },
          ],
        },
        { headers: headers },
      );

      if (response.data.success) {
        setAlertSuccess(
          `Đã xác nhận bảo hành cho sản phẩm "${truncate(product.name)}"`,
        );
      }
    } catch (error) {
      console.log(error);
      setAlertFalse('Không thể xác nhận bảo hành, vui lòng thử lại sau');
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
            // setTrigger(!trigger);
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
        <div className='warranty-receive-header'>Tiếp nhận bảo hành</div>

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

        {bills
          .filter((bill) =>
            search || search !== ''
              ? bill.bill_code?.toString().toLowerCase() ===
                search?.toString().toLowerCase()
              : null,
          )
          .map((bill, index) => {
            return (
              <div className='warranty-check-list'>
                {isAlert
                  ? alertId === bill._id
                    ? isSuccess
                      ? SuccessAlert()
                      : DangerAlert()
                    : ''
                  : ''}

                <div className='warranty-check-item'>
                  <div className='wci-info'>
                    <div className='wci-customer'>
                      Khách hàng: {bill.customer.name}
                    </div>

                    <div className='wci-date'>
                      Ngày đặt: {moment(bill.createAt).format('DD/MM/YYYY')}
                    </div>
                  </div>

                  {bill.cart_list.map((cart) => {
                    const expirationDate = getDuration(
                      cart.product.type,
                      bill.createAt,
                    );
                    return (
                      <div className='wci-detail'>
                        <div className='wci-product'>
                          <div className='wci-product-info'>
                            <div className='image'>
                              <img src={cart.product.image} alt='' />
                            </div>
                            <div className='name'>
                              <p className='m-0'>{cart.product.name}</p>
                              <p className='m-0'>x {cart.quantity}</p>
                              <div className='wci-check'>
                                Ngày hết hạn: {expirationDate || 'N/A'}
                              </div>
                            </div>
                          </div>

                          <div className='wci-product-check'>
                            <div
                              onClick={() =>
                                handleSubmit(bill._id, cart.product)
                              }
                              className='wci-button'
                            >
                              Xác nhận bảo hành
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}
