import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { apiURL } from '../../../../../contexts/constants';
import { useReactToPrint } from 'react-to-print';
import Moment from 'react-moment';

import { PrintWarehouse } from '../../warehouse-printing/PrintWarehouse';

export default function ExportDetail() {
  // get product id
  const location = useLocation();
  const productId = location.state.productId;
  const date = location.state.date;

  // get export data by productId
  const [exports, setExports] = useState([]);
  useEffect(() => {
    try {
      axios
        .get(`${apiURL}/export`)
        .then((response) =>
          setExports(
            response.data.exports.filter(
              (exp) =>
                moment(exp.createAt).format('DD/MM/YYYY') === date &&
                exp.product._id === productId,
            ),
          ),
        );
    } catch (error) {
      console.log(error);
    }
  });

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
      <div className='warehouse-export-container p-2'>
        <div className='whe-header'>Chi tiết xuất kho</div>

        {exports?.map((exp, index) => {
          return (
            <>
              <div className='invoice-process-container'>
                <div
                  key={index}
                  className='ip-customer d-flex justify-content-between'
                >
                  <div>Khách hàng: {exp.bill.customer.name}</div>
                  <div>
                    Ngày đặt:
                    <Moment className='ml-2' format='DD/MM/YYYY'>
                      {exp.bill.createAt}
                    </Moment>
                  </div>
                </div>

                <div className='ip-product-container'>
                  {exp.bill.cart_list.map((cart) => {
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
                    {formatter.format(exp.bill.last_cost)} VNĐ
                  </div>

                  <div className='prepare-container d-flex justify-content-between align-items-center'>
                    <div className='prepare-content'>
                      {invoices?.map((invoice) => {
                        if (invoice.bill_id.includes(exp.bill._id))
                          return (
                            <>
                              <div className='employee'>
                                Nhân viên xuất kho: {invoice.export_staff.name}
                              </div>
                            </>
                          );
                      })}
                    </div>
                    <div
                      onClick={() => {
                        handlePrint(exp.bill);
                      }}
                      className='prepare-btn'
                    >
                      In phiếu xuất kho
                    </div>
                  </div>
                </div>
                <div style={{ display: 'none' }}>
                  <PrintWarehouse ref={componentRef} printData={exp.bill} />
                </div>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
}
