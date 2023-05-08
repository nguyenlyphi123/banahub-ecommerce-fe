import React, { useEffect, useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { cartSelector } from '../../../redux/reducers/cartSlice';
import { deleteCart } from '../../../redux/reducers/cartSlice';

import { AuthContext } from '../../../contexts/AuthContext';
import axios from 'axios';

import {
  apiURL,
  LOCAL_STORAGE_ACCESS_TOKEN,
} from '../../../contexts/constants';

export default function PaymentPage() {
  // redux
  const cartItems = useSelector(cartSelector);
  const dispatch = useDispatch();

  // authContext
  const {
    authState: { customer },
    logout,
  } = useContext(AuthContext);

  //location
  const location = useLocation();
  const promotion = location.state.promotion;

  // get customer info
  const [customerInfo, setCustomerInfo] = useState({});

  useEffect(() => {
    axios
      .get(`${apiURL}/customer/${customer._id}`)
      .then((res) => setCustomerInfo(res.data.customer))
      .catch((err) => console.log(err));
  }, []);

  // customer info
  const [customerInput, setCustomerInput] = useState({
    receiver: '',
    address: '',
    phone_number: '',
  });

  const handleChangeCustomerInput = (e) => {
    setCustomerInput({ ...customerInput, [e.target.name]: e.target.value });
  };

  // get productId and cart_quantity
  var carts;

  function handleTransData(item) {
    return {
      product: item._id,
      quantity: item.cart_quantity,
    };
  }

  carts = cartItems.map(handleTransData);

  // handlePaymentSubmit
  const navigate = useNavigate();

  const handlePaymentSubmit = async () => {
    const headers = {
      'Authorization': `Bearer ${localStorage.getItem(
        LOCAL_STORAGE_ACCESS_TOKEN,
      )}`,
    };

    try {
      const response = await axios.post(
        `${apiURL}/bill/create`,
        {
          customer: customer.info._id,
          cart_list: carts,
          discount: promotion._id,
          total_cost: totalPrice,
          last_cost: lastPrice,
        },
        { headers: headers },
      );

      if (response.data.success) {
        const invoice = response.data.newBill;
        await axios
          .put(`${apiURL}/customer/deliver/${customer._id}`, customerInput, {
            headers: headers,
          })
          .then((res) => {
            dispatch(deleteCart());
            navigate('/invoice', {
              state: {
                customer: customerInput,
                cartItems,
                promotion,
                invoice,
              },
            });
          })
          .catch((err) => console.log(err));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatter = new Intl.NumberFormat('en');
  const totalPrice = cartItems.reduce(
    (price, item) => price + item.price * item.cart_quantity,
    0,
  );
  const lastPrice =
    promotion !== 0
      ? totalPrice - (totalPrice * promotion.promotion_percent) / 100
      : totalPrice;

  // crop product name
  const truncate = (e) => {
    return e.length > 30 ? e.substring(0, 20) + '...' : e;
  };

  return (
    <>
      <div
        className='container-fluid container-center'
        style={{ marginTop: '3rem' }}
      >
        <div className='sub-container' style={{ width: '80%' }}>
          <div className='row'>
            <div className='col-lg-7 col-md-12'>
              <h4 className='text-uppercase' style={{ fontSize: '20px' }}>
                thông tin thanh toán
              </h4>

              <div className='form-group mt-2'>
                <label className='mb-2'>Người đặt</label>
                <input
                  className='form-control'
                  value={customer.info.name}
                  name='name'
                  type='text'
                  placeholder='Họ và tên'
                  disabled
                />
              </div>
              <div className='form-group'>
                <label className='mb-2'>Người nhận</label>
                <input
                  onChange={(e) => handleChangeCustomerInput(e)}
                  className='form-control'
                  value={customerInput.receiver}
                  name='receiver'
                  type='text'
                  placeholder='Tên người nhận'
                  required
                />
              </div>
              <div className='form-group'>
                <label className='mb-2'>Địa chỉ</label>
                <input
                  onChange={(e) => handleChangeCustomerInput(e)}
                  className='form-control'
                  value={customerInput.address}
                  name='address'
                  type='text'
                  placeholder='Địa chỉ'
                  required
                />
              </div>

              <div className='form-group'>
                <label className='mb-2'>Số điện thoại</label>
                <input
                  onChange={(e) => handleChangeCustomerInput(e)}
                  className='form-control'
                  value={customerInput.phone_number}
                  name='phone_number'
                  type='text'
                  placeholder='Số điện thoại'
                  required
                />
              </div>
              <div className='form-group'>
                <label className='mb-2'>Địa chỉ Email</label>
                <input
                  className='form-control'
                  value={customer.email}
                  name='email'
                  type='email'
                  placeholder='Số điện thoại'
                  required
                  disabled
                />
              </div>

              <div className='form-group text-center'>
                <Link
                  onClick={() => logout()}
                  to='/login'
                  className='btn btn-outline-danger'
                >
                  Hoặc đăng nhập bằng tài khoản khác
                </Link>
              </div>
            </div>
            <div className='col-lg-5 col-md-12'>
              <div
                className='item-detail'
                style={{ border: '2px solid #e1a452', padding: '25px' }}
              >
                <h5
                  className='text-uppercase text-center'
                  style={{ fontSize: '20px' }}
                >
                  đơn hàng của bạn
                </h5>
                <table className='table table-borderless'>
                  <thead>
                    <tr
                      style={{
                        borderBottom: '3px solid rgba(187, 187, 187, .3)',
                      }}
                    >
                      <td>SẢN PHẨM</td>
                      <td className='text-right'>TỔNG</td>
                    </tr>
                  </thead>
                </table>

                <table className='table'>
                  <tbody>
                    <div>
                      {cartItems.map((item) => {
                        return (
                          <div
                            className='d-flex justify-content-between pb-3'
                            style={{
                              borderBottom: '1px solid rgb(201, 201, 201)',
                              paddingTop: '15px',
                            }}
                          >
                            <p>
                              {truncate(item.name)} x {item.cart_quantity}
                            </p>
                            <p
                              className='text-right'
                              style={{
                                color: '#be9329',
                                fontWeight: 600,
                                width: '170px',
                              }}
                            >
                              {formatter.format(
                                item.price * item.cart_quantity,
                              )}
                              VNĐ
                            </p>
                          </div>
                        );
                      })}

                      <div
                        className='d-flex justify-content-between align-items-center'
                        style={{
                          borderBottom: '1px solid rgb(201, 201, 201)',
                          padding: '10px 0',
                        }}
                      >
                        <p className='mb-0'>Tổng</p>
                        <p
                          style={{
                            marginBottom: 0,
                            color: '#be9329',
                            fontWeight: 600,
                          }}
                        >
                          {formatter.format(totalPrice)} VNĐ
                        </p>
                      </div>
                      <div
                        className='d-flex justify-content-between align-items-center'
                        style={{
                          borderBottom: '1px solid rgb(201, 201, 201)',
                          padding: '10px 0',
                        }}
                      >
                        <p className='mb-0'>Mã giảm giá</p>
                        {promotion !== 0 ? (
                          <div className='promotion-box choosed pl-3 pr-3'>
                            <span className='promotion-box-tl'></span>
                            <span className='promotion-box-tr'></span>
                            <div className='promotion-content text-center'>
                              {promotion.name}
                            </div>
                            <span className='promotion-box-bl'></span>
                            <span className='promotion-box-br'></span>
                          </div>
                        ) : (
                          <div style={{ color: '#be9329', fontWeight: 600 }}>
                            Chưa áp dụng mã giảm giá
                          </div>
                        )}
                      </div>
                      <div
                        className='d-flex justify-content-between align-items-center'
                        style={{
                          borderBottom: '3px solid rgba(187, 187, 187, .3)',
                          padding: '10px 0',
                        }}
                      >
                        <p className='mb-0'>Tổng</p>
                        {promotion !== 0 ? (
                          <div>
                            <p
                              className='text-right d-flex pb-3 m-0'
                              style={{ color: '#be9329', fontWeight: 600 }}
                            >
                              <p className='mr-2'>
                                Giảm {promotion.promotion_percent}%
                              </p>
                              <del>{formatter.format(totalPrice)} VNĐ</del>
                            </p>
                            <p
                              className='text-right m-0'
                              style={{ color: '#be9329', fontWeight: 600 }}
                            >
                              {formatter.format(lastPrice)} VNĐ
                            </p>
                          </div>
                        ) : (
                          <p
                            style={{
                              marginBottom: 0,
                              color: '#be9329',
                              fontWeight: 600,
                            }}
                          >
                            {formatter.format(totalPrice)} VNĐ
                          </p>
                        )}
                      </div>
                      <div
                        className='text-center'
                        style={{ marginTop: '20px' }}
                      >
                        <button
                          onClick={() => handlePaymentSubmit()}
                          className='btn btn-danger'
                        >
                          ĐẶT HÀNG
                        </button>
                      </div>
                    </div>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
