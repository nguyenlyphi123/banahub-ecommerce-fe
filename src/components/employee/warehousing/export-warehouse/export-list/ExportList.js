import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { apiURL } from '../../../../../contexts/constants';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

export default function ExportList() {
  // get export data
  const [exportUnique, setExportUnique] = useState([]);

  useEffect(() => {
    try {
      axios.get(`${apiURL}/export`).then((response) => {
        const uniqueDates = [
          ...new Set(
            response.data.exports.map((exp) =>
              moment(exp.createAt).format('DD/MM/YYYY'),
            ),
          ),
        ];
        const uniqueExports = uniqueDates.map((date) => {
          const exportsOnDate = response.data.exports.filter(
            (exp) => moment(exp.createAt).format('DD/MM/YYYY') === date,
          );
          const uniqueProducts = [
            ...new Set(exportsOnDate.map((exp) => exp.product)),
          ];
          const uniqueExportsByProduct = uniqueProducts.map((product) => {
            const quantity = exportsOnDate
              .filter((exp) => exp.product === product)
              .reduce((acc, exp) => acc + exp.quantity, 0);
            return { product, quantity };
          });
          return {
            date: date,
            export: uniqueExportsByProduct,
          };
        });
        setExportUnique(uniqueExports);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  // handle sort date
  const [dateSort, setDateSort] = useState();
  const handleSortDate = (e) => {
    setDateSort(e.target.value);
  };

  const handleResetSortDate = () => {
    setDateSort();
  };

  // navigate
  const navigate = useNavigate();

  // crop product name
  const truncate = (e) => {
    return e.length > 55 ? e.substring(0, 40) + '...' : e;
  };

  return (
    <>
      <div className='whe-sort-date-container d-flex align-items-center'>
        <div className='mr-2'>Chọn ngày hiển thị</div>
        <div className='whe-sort-date'>
          <input
            onChange={(e) => handleSortDate(e)}
            className='whe-sort-input'
            type='date'
            name=''
            value={dateSort}
          />
        </div>
        {dateSort ? (
          <div onClick={handleResetSortDate} className='whe-sort-date-choosed'>
            {dateSort} <i class='fas fa-times'></i>
          </div>
        ) : (
          ''
        )}
      </div>

      {exportUnique
        .filter((exp) =>
          dateSort ? exp.date === moment(dateSort).format('DD/MM/YYYY') : exp,
        )
        .sort((a, b) => (a.date > b.date ? -1 : 1))
        .slice(0, 10)
        .map((exp, index) => {
          return (
            <div key={index} className='warehouse-export-container'>
              <div className='whe-date'>
                Danh sách xuất kho ngày: {exp.date}
              </div>
              <div className='whe-list-container row'>
                {exp.export.map((product) => {
                  return (
                    <div
                      key={product.product._id}
                      className='whe-list-item d-flex align-items-center col-6'
                    >
                      <div className='whe-image mr-2'>
                        <img
                          src={product.product.image}
                          alt=''
                          style={{ width: '100px' }}
                        />
                      </div>

                      <div className='whe-product-info'>
                        <div className='whe-name'>
                          Tên sản phẩm: {truncate(product.product.name)}
                        </div>

                        <div className='whe-quantity'>
                          Đã xuất kho: {product.quantity}
                        </div>

                        <div
                          onClick={() =>
                            navigate(
                              `/employee/warehousing/export/${product.product._id}`,
                              {
                                state: {
                                  productId: product.product._id,
                                  date: exp.date,
                                },
                              },
                            )
                          }
                          className='whe-button btn'
                        >
                          Xem chi tiết
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
    </>
  );
}
