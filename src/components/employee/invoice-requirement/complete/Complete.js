import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import Moment from 'react-moment';
import { useReactToPrint } from 'react-to-print';
import { PrintInvoice } from '../processed/PrintInvoice';

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

export default function Complete() {
  // get bill data
  const [bill, setBill] = useState([]);

  useEffect(() => {
    try {
      axios
        .get(`${apiURL}/bill`)
        .then((res) =>
          setBill(
            res.data.bills
              .filter(
                (item) => item.status !== PREPARING && item.status !== AWAITING,
              )
              .sort((a, b) => Date.parse(b.createAt) - Date.parse(a.createAt)),
          ),
        )
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  }, []);

  // get invoices
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    try {
      axios
        .get(`${apiURL}/invoice-requirement`)
        .then((res) => setInvoices(res.data.invoices))
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  }, []);

  // Printing
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTittle: 'Product Invoice',
  });

  // Convert number
  const formatter = new Intl.NumberFormat('en');

  return (
    <>
      {bill?.map((item, index) => {
        return (
          <div key={index} className='invoice-process-container'>
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
                          <div>
                            Xin vui lòng nhấn "Sắp xếp nhân viên" để sắp xếp
                            nhân viên xuất kho chuẩn bị cho đơn hàng.
                          </div>
                        );
                  })}
                </div>
                {invoices.map((inv) => {
                  if (inv.bill_id.includes(item._id))
                    return (
                      <div
                        onClick={() => {
                          handlePrint(item);
                        }}
                        className='prepare-btn'
                      >
                        In biên bảng bàn giao
                      </div>
                    );
                })}
              </div>
            </div>
            <div style={{ display: 'none' }}>
              <PrintInvoice ref={componentRef} printData={item} />
            </div>
          </div>
        );
      })}
    </>
  );
}
