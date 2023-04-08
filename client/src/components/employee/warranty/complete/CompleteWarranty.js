import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  apiURL,
  LOCAL_STORAGE_ACCESS_TOKEN_EMPLOYEE,
} from '../../../../contexts/constants';
import moment from 'moment';
import { COMPLETE, TRANSFERED, TRANSFERING } from '../../../constant/constants';
import { useReactToPrint } from 'react-to-print';
import { WarrantyPrint } from '../transfered/WarrantyPrint';

// import('./Transfered.css');

export default function CompleteWarranty() {
  // get warranty data
  const [warranties, setWarranties] = useState([]);
  useEffect(() => {
    axios
      .get(`${apiURL}/warranty`)
      .then((res) =>
        setWarranties(
          res.data.warranties.filter((warr) => warr.status === COMPLETE),
        ),
      )
      .catch((err) => console.log(err));
  }, []);

  // handle search
  const [search, setSearch] = useState('');
  const handleSearch = (e) => {
    setSearch(e.target.value);
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
        <div className='warranty-receive-header'>
          Đơn bảo hành đã hoàn thành
        </div>

        {warranties.length === 0 ? (
          <div className='warranty-empty'>
            <i class='fas fa-box-open'></i>
            Tạm thời không có đơn hàng nào đã hoàn thành
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
                        onClick={() => handlePrint(warr)}
                        className='warranty-receive-button'
                      >
                        In biên bảng bàn giao
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
