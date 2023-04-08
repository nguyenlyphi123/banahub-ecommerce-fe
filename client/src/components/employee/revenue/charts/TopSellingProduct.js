import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiURL } from '../../../contexts/constants';

export default function TopSellingProduct() {
  const [topSellingProduct, setTopSellingProduct] = useState([]);

  // Get product data
  useEffect(() => {
    axios
      .get(`${apiURL}/product/getall`)
      .then((res) => {
        setTopSellingProduct(
          res.data.sort((a, b) => b.product_sold - a.product_sold).slice(0, 5),
        );
      })
      .catch((err) => console.log(err));
  }, []);

  // Convert number
  const formatter = new Intl.NumberFormat('en');

  return (
    <>
      <table className='table text-center borderless mt-2'>
        <thead
          style={{
            color: '#64c5b1',
            backgroundColor: 'rgb(240 255 252)',
          }}
        >
          <tr>
            <th>Product</th>
            <th>Code</th>
            <th>Price</th>
            <th>Size</th>
            <th>Sold</th>
          </tr>
        </thead>
        <tbody>
          {topSellingProduct.map((item, index) => {
            return (
              <tr key={index}>
                <td>
                  <img
                    style={{ height: '35px' }}
                    src={item.product_image}
                    alt=''
                  />
                </td>
                <td style={{ color: '#bda5f8' }}>{item.product_code}</td>
                <td style={{ color: '#ffb98a' }}>
                  {formatter.format(item.product_price)} VNĐ
                </td>
                <td style={{ color: '#64c5b1' }}>{item.product_size}</td>
                <td style={{ color: '#6fa5ec' }}>{item.product_sold}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
