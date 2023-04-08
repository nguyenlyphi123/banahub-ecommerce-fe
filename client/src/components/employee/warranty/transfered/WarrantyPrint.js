import React from 'react';
import moment from 'moment';

// import './PrintInvoice.css';

export const WarrantyPrint = React.forwardRef((props, ref) => {
  const warranties = props.printData;

  // calc date end
  const getDuration = (date, timestamp) => {
    const orderDate = moment(date);
    const endDate = orderDate.add(timestamp, 'days');
    return moment(endDate).format('DD/MM/YYYY');
  };

  return (
    <>
      <div ref={ref}>
        <div className='print-invoice-container'>
          <div className='print-header text-uppercase text-center'>
            biên bản bàn giao
          </div>
          <div className='print-date mb-3'>Ngày: {moment().format('L')}</div>
          <div className='print-product'>
            <table class='table table-bordered'>
              <thead>
                <tr>
                  <th scope='col'>STT</th>
                  <th scope='col'>Tên sản phẩm</th>
                  <th scope='col'>Danh mục bảo hành</th>
                  <th scope='col'>Chi tiết bảo hành</th>
                  <th scope='col'>Ngày nhận hàng ước tính</th>
                  <th scope='col'>Ngày nhận hàng thật tế</th>
                </tr>
              </thead>
              <tbody>
                {warranties.warranty_list?.map((item, index) => {
                  const expirationDate = getDuration(
                    warranties.createAt,
                    item.expected_duration,
                  );
                  return (
                    <tr>
                      <th scope='row'>{index + 1}</th>
                      <td>{item.product.name}</td>
                      <td>{item.warranty_category.name}</td>
                      <td>{item.warranty_pursuit.name}</td>
                      <td>{expirationDate || 'N/A'}</td>
                      <td>
                        {moment(item.date_receiving).format('DD/MM/YYYY')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className='print-hand-sign row mt-4'>
            <div className='responsible_staff text-center col-6'>
              Nhân viên xuất phiếu
            </div>

            <div className='engineering_staff text-center col-6'>
              Khách hàng
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
