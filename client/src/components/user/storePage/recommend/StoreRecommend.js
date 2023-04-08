import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function StoreRecommend({ typeId }) {
  const [reconmmend, setRecommend] = useState([]);
  const [isNotExist, setIsNotExist] = useState(false);

  useEffect(() => {
    if (!typeId) {
      axios.get(`http://localhost:6001/api/product`).then((res) => {
        setIsNotExist(false);
        setRecommend(res.data.products);
      });
    } else
      axios
        .get(`http://localhost:6001/api/product/type/${typeId}`)
        .then((res) => {
          setIsNotExist(false);
          setRecommend(res.data.product);
        })
        .catch((err) => setIsNotExist(true));
  }, [typeId]);

  const formatter = new Intl.NumberFormat('en');

  return (
    <>
      {!isNotExist ? (
        <div className='list-group mt-4'>
          <h5
            className='text-center mb-2'
            style={{ color: '#be9329', fontWeight: 500, fontSize: '1.4em' }}
          >
            SẢN PHẨM NỔI BẬT
          </h5>
          <div className='list-item'>
            {reconmmend?.slice(0, 5).map((item, index) => {
              return (
                <Link
                  key={index}
                  to={'/store/product/' + item._id}
                  state={{ product: item }}
                  className='list-group-item list-group-item-action item-link'
                >
                  <div className='sub-item text-center d-flex flex-row'>
                    <img
                      src={item.image}
                      alt=''
                      style={{ width: '100px', height: '100px' }}
                    />
                    <div className='item-context'>
                      <p
                        className='text-uppercase mb-0'
                        style={{ fontWeight: 500, fontSize: '0.75em' }}
                      >
                        {item.name}
                      </p>
                      <p className='card-text' style={{ color: '#be9329' }}>
                        {formatter.format(item.price)} VNĐ
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
}
