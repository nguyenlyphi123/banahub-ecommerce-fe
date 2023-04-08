import React from 'react';
import moment from 'moment';

import './PrintInvoice.css';

export const PrintInvoice = React.forwardRef((props, ref) => {
  const bill = props.printData;

  return (
    <>
      <div ref={ref}>
        <div className='print-invoice-container'>
          <div className='print-header text-uppercase text-center'>
            phiếu xuất kho
          </div>
          <div className='print-date mb-3'>Ngày: {moment().format('L')}</div>
          <div className='print-product'>
            <table class='table table-bordered'>
              <thead>
                <tr>
                  <th scope='col'>STT</th>
                  <th scope='col'>Product_name</th>
                  <th scope='col'>Product_code</th>
                  <th scope='col'>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {bill.cart_list?.map((item, index) => {
                  return (
                    <tr>
                      <th scope='row'>{index + 1}</th>
                      <td>{item.product.name}</td>
                      <td>{item.product._id}</td>
                      <td>{item.quantity}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className='print-hand-sign row mt-4'>
            <div className='responsible_staff text-center col-4'>
              Người xuất phiếu
            </div>
            <div className='export_staff text-center col-4'>
              Nhân viên xuất kho
            </div>
            <div className='engineering_staff text-center col-4'>
              Nhân viên kỹ thuật
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
