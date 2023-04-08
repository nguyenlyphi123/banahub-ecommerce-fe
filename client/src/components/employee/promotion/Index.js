import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { apiURL } from '../../../contexts/constants';
import { ACTIVE, ENDED, PROCESSING } from '../../constant/constants';
import('../stylesheet/Promotion.css');

function CustomLink({ link, activeLink, onClick, to }) {
  const isActive = link === activeLink;
  const style = isActive
    ? {
        color: 'rgb(255, 77, 33)',
        borderBottom: '3px solid rgb(255, 77, 33)',
      }
    : { color: 'rgba(0, 0, 0, 0.604)' };

  return (
    <div
      style={style}
      className='emp-promotion-nav-item col-3'
      onClick={() => onClick(link)}
    >
      {link}
    </div>
  );
}

export default function Promotion() {
  const [activeLink, setActiveLink] = useState('');

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  // promotion data
  const [promotion, setPromotion] = useState([]);

  useEffect(() => {
    axios
      .get(`${apiURL}/promotion`)
      .then((res) => setPromotion(res.data.promotion))
      .catch((err) => console.log(err));
  }, []);

  // customerRank date
  const [customerRank, setCustomerRank] = useState([]);

  useEffect(() => {
    axios
      .get(`${apiURL}/customer_rank`)
      .then((res) => setCustomerRank(res.data.customerRank))
      .catch((err) => console.log(err));
  }, []);

  // handle filter status
  const [status, setStatus] = useState('');
  const handleFilterStatus = (value) => {
    setStatus(value);
  };

  // handle filter customer rank
  const [customer, setCustomer] = useState(0);
  const [customerHeader, setCustomerHeader] = useState('Chọn loại khuyến mãi');
  const handleFilterCustomer = (value) => {
    setCustomer(value.rank);
    setCustomerHeader(value.name);
  };

  return (
    <>
      <div className='emp-promotion-container'>
        <div className='emp-promotion-nav-container row'>
          <CustomLink
            link='Tất cả'
            activeLink={activeLink}
            onClick={(e) => {
              handleLinkClick(e);
              handleFilterStatus('');
            }}
            to='/employee/promotion'
          />

          <CustomLink
            link='Sắp diễn ra'
            activeLink={activeLink}
            onClick={(e) => {
              handleLinkClick(e);
              handleFilterStatus(PROCESSING);
            }}
            to='/employee/invoices/processed'
          />

          <CustomLink
            link='Đang hoạt động'
            activeLink={activeLink}
            onClick={(e) => {
              handleLinkClick(e);
              handleFilterStatus(ACTIVE);
            }}
            to='/employee/invoices/processed'
          />

          <CustomLink
            link='Đã kết thúc'
            activeLink={activeLink}
            onClick={(e) => {
              handleLinkClick(e);
              handleFilterStatus(ENDED);
            }}
            to='/employee/invoices/processed'
          />
        </div>

        <div className='customer-rank-filter-container mt-3'>
          <div className='new-emp-promotion-container'>
            <Link
              to='/employee/promotion/create'
              className='new-emp-promotion-button'
            >
              Tạo khuyến mãi mới
            </Link>
          </div>
          <div class='dropdown'>
            <button
              type='button'
              class='btn customer-rank-filter-button dropdown-toggle'
              data-toggle='dropdown'
            >
              {customerHeader}
            </button>
            <div class='dropdown-menu customer-rank-filter-menu'>
              {customerRank.map((item) => {
                return (
                  <div
                    onClick={() => handleFilterCustomer(item)}
                    key={item._id}
                    class='dropdown-item customer-rank-filter-item'
                  >
                    {item.name}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className='emp-promotion-list mt-2'>
          {promotion
            ?.filter((item) => {
              if (customer === 0) {
                return item;
              }

              return item.rank.rank === customer;
            })
            .filter((item) => {
              if (status) {
                return item.status === status;
              }

              return item;
            })
            .map((item, index) => {
              return (
                <Link
                  key={index}
                  to='/employee/promotion/update'
                  state={{ promotion: item }}
                  className='emp-promotion-item'
                >
                  <div className='emp-promotion-detail d-flex align-items-center'>
                    <div className='emp-promotion-image'>
                      <i
                        class='fas fa-ticket-alt'
                        style={{ fontSize: '4.5em' }}
                      ></i>
                    </div>
                    <div className='emp-promotion-content ml-3'>
                      <div className='date'>
                        {moment(item.start).format('L')}
                        {' - '}
                        {moment(item.end).format('L')}
                      </div>

                      <div className='discount'>
                        Giảm {item.promotion_percent}%
                      </div>

                      <div className='object mt-1'>{item.name}</div>
                    </div>
                    {(() => {
                      if (item.status === PROCESSING) {
                        return (
                          <div className='emp-promotion-status processing'>
                            Sắp diễn ra
                          </div>
                        );
                      } else if (item.status === ACTIVE) {
                        return (
                          <div className='emp-promotion-status activating'>
                            Đang hoạt động
                          </div>
                        );
                      } else {
                        return (
                          <div className='emp-promotion-status ended'>
                            Đã kết thúc
                          </div>
                        );
                      }
                    })()}
                  </div>
                  <div className='emp-promotion-used d-flex justify-content-between w-50 mt-1'>
                    <div>Đã sử dụng {item.use}</div>
                    <div className='ml-4'>
                      Còn lại {item.quantity - item.use}
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </>
  );
}
