import React, { useEffect, useRef, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Moment from 'moment';

import './InvoicePage.css';

export default function InvoicePage() {
  // location
  const location = useLocation();
  const { customer, cartItems, promotion, invoice } = location.state;

  // Convert number
  const formatter = new Intl.NumberFormat('en');

  return (
    <>
      <div className='container-fluid'>
        <div className='bill-detail-container'>
          <div className='bill-sub-container'>
            <div className='bill-content'>
              <div className='logo mt-3 mb-3'>Đặt hàng thành công</div>

              <div className='bill-header'>
                <div className='bill-context'>invoice</div>
              </div>

              <div className='bill-section'>
                <h5 className='font-weight-bolder'>Invoice to:</h5>
                <div className='bill-info d-flex justify-content-between'>
                  <div className='b-customer-info'>
                    <h6 className='font-weight-bolder'>{customer.receiver}</h6>
                    <p className='mb-1'>
                      <b>Phone number:</b> {customer.phone_number}
                    </p>
                    <p>
                      <b>Address:</b> {customer.address}
                    </p>
                  </div>

                  <div className='b-bill-info w-25'>
                    <div className='bill-code d-flex justify-content-between'>
                      <p className='w-50 m-0'>Bill Code:</p>
                      <p className='m-0'>{invoice.bill_code}</p>
                    </div>

                    <div className='bill-date d-flex justify-content-between'>
                      <p className='w-50 m-0'>Date:</p>
                      <p className='m-0'>
                        {Moment(invoice.createAt).format('DD-MM-YYYY')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='bill-table'>
                  <table class='table table-bordered text-center mb-0'>
                    <thead className='thead-dark'>
                      <tr>
                        <th>No.</th>
                        <th>Product Name</th>
                        <th>Image</th>
                        <th>Product Price</th>
                        <th>Quantity</th>
                        <th style={{ width: '180px' }}>Total Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item, index) => {
                        return (
                          <>
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.name}</td>
                              <td>
                                <img
                                  src={item.image}
                                  alt=''
                                  style={{ width: '45px' }}
                                />
                              </td>
                              <td className='font-weight-bolder'>
                                {formatter.format(item.price)} VNĐ
                              </td>
                              <th className='font-weight-bolder'>
                                {item.cart_quantity}
                              </th>
                              <th className='font-weight-bolder'>
                                {formatter.format(
                                  item.price * item.cart_quantity,
                                )}
                                VNĐ
                              </th>
                            </tr>
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className='bill-payment-info d-flex justify-content-between mt-2'>
                  <div className='payment-info'>
                    <b>Thank you for your business</b>

                    <div className='payment mt-3'>
                      <b>Payment Method</b>

                      <div className='d-flex'>
                        <p className='m-0 w-40'>Name: </p>
                        <p className='m-0'>{customer.receiver}</p>
                      </div>

                      <div className='d-flex'>
                        <p className='w-40'>Method: </p>
                        <p>{invoice.payment_methods}</p>
                      </div>
                    </div>
                  </div>

                  <div className='latter-cost'>
                    <div className='d-flex'>
                      <b className='w-50 m-0'>Sub total: </b>
                      <p className='m-0'>
                        {/* {(() => {
                        let total = 0;
                        billDetail.cart_list.map((item) => {
                          total += item.product_price * item.quantity;
                        });
                        return formatter.format(total);
                      })()} */}
                        {formatter.format(invoice.total_cost)}
                        <span> VNĐ</span>
                      </p>
                    </div>

                    <div className='d-flex'>
                      <b className='w-50 m-0'>Discount: </b>
                      <p className='m-0'>
                        {promotion !== 0 ? promotion.promotion_percent : 0} %
                      </p>
                    </div>

                    <div className='d-flex'>
                      <b className='w-50 m-0'>Total: </b>
                      <p className='m-0'>
                        {formatter.format(invoice.last_cost)} VNĐ
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='bill-footer mt-3 mb-3 ml-4'>
            <div className='bf-button'>
              <Link to='/' className='btn btn-secondary btn-md'>
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
