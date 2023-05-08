import React from 'react';

import RevenueBarChart from './charts/RevenueBarChart';
import DailySaleLineChart from './charts/DailySaleLineChart';
import TotalOrderPieChart from './charts/TotalOrderPieChart';
import BestWeeklySellingProductPolarChart from './charts/BestWeeklySellingProductPolarChart';
import('../stylesheet/Revenue.css');

export default function Revenue() {
  return (
    <>
      <div className='dashboard-container w-100 p-4'>
        <div className='row'>
          <div className='db-revenue col-lg-8 pr-2 pb-2 pl-3'>
            <div className='revenue border rounded h-100 w-100 flex-column'>
              <div
                className='font-weight-bolder'
                style={{ color: '#767676', fontFamily: 'sans-serif' }}
              >
                Doanh thu từng tháng
              </div>
              <RevenueBarChart />
            </div>
          </div>

          <div className='db-market col-lg-4 pr-3 pb-2 pl-3'>
            <div className='market-value border rounded h-100 w-100 flex-column'>
              <div
                className='font-weight-bolder'
                style={{ color: '#767676', fontFamily: 'sans-serif' }}
              >
                Sản phẩm bán chạy trong tuần
              </div>
              <BestWeeklySellingProductPolarChart />
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='db-daily-sales col-lg-8 pt-3 pr-2 pb-2 pl-3'>
            <div className='daily-sales border rounded flex-column h-100 w-100'>
              <div
                className='font-weight-bolder'
                style={{ color: '#767676', fontFamily: 'sans-serif' }}
              >
                Doanh thu trong tuần
              </div>
              <DailySaleLineChart />
            </div>
          </div>

          <div className='db-total-order col-lg-4 pr-3 pt-3 pb-2 pl-3'>
            <div className='total-order border rounded h-100 w-100 flex-column'>
              <div
                className='font-weight-bolder'
                style={{ color: '#767676', fontFamily: 'sans-serif' }}
              >
                Tổng hóa đơn
              </div>
              <TotalOrderPieChart />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
