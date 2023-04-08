import React, { useEffect, useState, useContext } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import {
  cartSelector,
  removeFromCart,
  updateQuantity,
} from '../../../redux/reducers/cartSlice';
import { typeSelector } from '../../../redux/reducers/typeSlice';

import { AuthContext } from '../../../contexts/AuthContext';

import { Link } from 'react-router-dom';
import axios from 'axios';

import('./Cart.css');

export default function CartPage() {
  // get customer data
  const {
    authState: { customer },
  } = useContext(AuthContext);

  // redux
  const cartItems = useSelector(cartSelector);

  // het typeId
  const typeId = useSelector(typeSelector);

  // handleRemoveFromCart
  const dispatch = useDispatch();

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
  };

  // handleUpdateQuantity
  const handleUpdateQuantity = (id, cart_quantity) => {
    dispatch(updateQuantity({ id, cart_quantity }));
  };

  // get promotion data
  const [promotionChoosed, setPromotionChoosed] = useState(0);
  const [promotion, setPromotion] = useState([]);
  useEffect(() => {
    axios
      .get(
        `http://localhost:6001/api/promotion/rank/${customer.info.rank}/${customer.info._id}`,
      )
      .then((res) => setPromotion(res.data.promotion))
      .catch((err) => console.log(err));

    console.log(customer._id);
  }, []);

  const formatter = new Intl.NumberFormat('en');
  const totalPrice = cartItems.reduce(
    (price, item) => price + item.price * item.cart_quantity,
    0,
  );
  const lastPrice =
    totalPrice - (totalPrice * promotionChoosed.promotion_percent) / 100;

  return (
    <>
      <div
        className='container-fluid container-center'
        style={{ marginTop: '3rem' }}
      >
        <div className='sub-container' style={{ width: '80%' }}>
          <div className='row'>
            <div className='col-lg-8 col-md-12'>
              <table className='table table-borderless'>
                <thead>
                  <tr
                    style={{
                      borderBottom: '2px solid rgba(201, 201, 201, .6)',
                    }}
                  >
                    <th className='text-uppercase table-context'>sản phẩm</th>
                    <th className='text-uppercase table-context'>giá</th>
                    <th className='text-uppercase table-context'>số lượng</th>
                    <th className='text-uppercase table-context'>tổng</th>
                  </tr>
                </thead>

                <tbody>
                  {cartItems ? (
                    cartItems?.map((item) => {
                      return (
                        <tr
                          style={{
                            borderBottom: '1px solid rgba(201, 201, 201, .6)',
                          }}
                        >
                          <th style={{ maxWidth: '400px' }}>
                            <div className='d-flex'>
                              {cartItems.length === 1 ? (
                                <div
                                  onClick={() => handleRemoveFromCart(item._id)}
                                  className='plus d-flex align-items-center'
                                  style={{ marginRight: '5px' }}
                                >
                                  <i className='fas fa-trash-alt' />
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleRemoveFromCart(item._id)}
                                  className='plus d-flex align-items-center'
                                  style={{ marginRight: '5px' }}
                                >
                                  <i className='fas fa-trash-alt' />
                                </button>
                              )}
                              <img
                                src={item.image}
                                alt=''
                                style={{ width: '90px', height: '90px' }}
                              />
                              <div className='d-flex align-items-center'>
                                <p
                                  style={{
                                    fontSize: '13px',
                                    fontWeight: 600,
                                  }}
                                >
                                  {item.name}
                                </p>
                              </div>
                            </div>
                          </th>
                          <th>
                            <div
                              className='d-flex align-items-center'
                              style={{
                                padding: '1.8rem 0',
                                color: '#be9329',
                                fontWeight: 600,
                                width: '130px',
                              }}
                            >
                              {formatter.format(item.price)} VNĐ
                            </div>
                          </th>
                          <th>
                            <div
                              className='d-flex justify-content-center'
                              style={{ padding: '1.8rem 0' }}
                            >
                              <input
                                onChange={(e) =>
                                  handleUpdateQuantity(item._id, e.target.value)
                                }
                                className='border-0'
                                style={{ width: '40px', height: '30px' }}
                                type='number'
                                min={1}
                                name='iSoLuong'
                                defaultValue={item.cart_quantity}
                                required
                              />
                            </div>
                          </th>
                          <th>
                            <div
                              className='d-flex align-items-center'
                              style={{
                                padding: '1.8rem 0',
                                color: '#be9329',
                                fontWeight: 600,
                                width: '130px',
                              }}
                            >
                              {formatter.format(
                                item.price * item.cart_quantity,
                              )}{' '}
                              VNĐ
                            </div>
                          </th>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td className='cart-null-alert'>
                        Chưa có sản phẩm trong giỏ hàng
                      </td>
                    </tr>
                  )}

                  <tr>
                    <td>
                      <Link
                        className='text-uppercase btn btn-outline-warning btn-block'
                        to={`/store/${typeId.name}`}
                      >
                        <i
                          className='fas fa-arrow-left'
                          style={{ marginRight: '10px' }}
                        />
                        tiếp tục xem sản phẩm
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              className='col-lg-4 col-md-12'
              style={{
                paddingLeft: '15px',
                borderLeft: '1px solid rgba(201, 201, 201, .2)',
              }}
            >
              <table className='table table-borderless'>
                <thead>
                  <tr
                    style={{
                      borderBottom: '2px solid rgba(201, 201, 201, .6)',
                    }}
                  >
                    <th className='text-uppercase table-context'>
                      tổng số lượng
                    </th>
                  </tr>
                </thead>
              </table>

              <table className='table' cellSpacing={0}>
                <tbody>
                  <div
                    className='d-flex justify-content-between'
                    style={{ borderBottom: '1px solid rgb(201, 201, 201)' }}
                  >
                    <p>Tổng phụ</p>
                    <p
                      className='pb-3'
                      style={{ color: '#be9329', fontWeight: 600 }}
                    >
                      {formatter.format(totalPrice)} VNĐ
                    </p>
                  </div>
                  <div
                    className='d-flex justify-content-between align-items-center'
                    style={{ borderBottom: '1px solid rgb(201, 201, 201)' }}
                  >
                    <p style={{ width: '100px' }}>Giao hàng</p>
                    <p
                      className='text-right pb-3 pt-3'
                      style={{ fontSize: '.9em' }}
                    >
                      Giao hàng miễn phí
                      <br />
                      Giá sẽ được cập nhập trong quá trình thanh toán
                      <br />
                      Tính phí giao hàng
                    </p>
                  </div>
                  <div
                    className='d-flex justify-content-between'
                    style={{
                      borderBottom: '1px solid rgb(201, 201, 201)',
                      paddingTop: '15px',
                    }}
                  >
                    <p>Tổng</p>

                    {promotionChoosed !== 0 ? (
                      <>
                        <div>
                          <p
                            className='text-right d-flex pb-3 m-0'
                            style={{ color: '#be9329', fontWeight: 600 }}
                          >
                            <p className='mr-2'>
                              Giảm {promotionChoosed.promotion_percent}%
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
                      </>
                    ) : (
                      <p
                        className='pb-3'
                        style={{ color: '#be9329', fontWeight: 600 }}
                      >
                        {formatter.format(totalPrice)} VNĐ
                      </p>
                    )}
                  </div>

                  <div className='text-left mb-1 pt-3'>
                    <p>
                      <i className='fas fa-tags mr-1' />
                      Phiếu ưu đãi
                    </p>
                  </div>

                  <div className='promotion-container mb-3'>
                    <div className='row'>
                      {promotion?.map((item, index) => {
                        return (
                          <div key={index} className='col-lg-6 mb-2'>
                            {item._id === promotionChoosed._id ? (
                              <div className='promotion-box choosed'>
                                <span className='promotion-box-tl'></span>
                                <span className='promotion-box-tr'></span>
                                <div className='promotion-content text-center'>
                                  {item.name}
                                </div>
                                <span className='promotion-box-bl'></span>
                                <span className='promotion-box-br'></span>
                              </div>
                            ) : (
                              <div
                                className='promotion-box'
                                onClick={() => setPromotionChoosed(item)}
                              >
                                <span className='promotion-box-tl'></span>
                                <span className='promotion-box-tr'></span>
                                <div className='promotion-content text-center'>
                                  {item.name}
                                </div>
                                <span className='promotion-box-bl'></span>
                                <span className='promotion-box-br'></span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className='text-center pt-3'>
                    <Link
                      className='text-uppercase btn bg-danger btn-block'
                      to='/payment'
                      state={{ promotion: promotionChoosed }}
                      style={{ color: '#fff' }}
                    >
                      Tiến hành thanh toán
                    </Link>
                  </div>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
