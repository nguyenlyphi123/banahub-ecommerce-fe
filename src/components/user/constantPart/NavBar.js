import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { cartSelector } from '../../../redux/reducers/cartSlice';
import { setType } from '../../../redux/reducers/typeSlice';

import './NavBar.css';
import { apiURL } from '../../../contexts/constants';

export default function Navbar() {
  const cartItems = useSelector(cartSelector);

  // fetch data
  const [typeList, setTypeList] = useState([]);

  useEffect(() => {
    axios
      .get(`${apiURL}/type`)
      .then((res) => {
        setTypeList(res.data.types);
      })
      .catch((err) => console.log(err));
  }, []);

  // redux
  const dispatch = useDispatch();

  const handleSetType = (typeId) => {
    dispatch(setType(typeId));
  };

  return (
    <div className='container-fluid container-center shadow-sm sticky d-flex justify-content-center'>
      <div className='sub-container' style={{ width: '80%' }}>
        <nav className='navbar navbar-expand-md bg-transparent navbar-light'>
          <Link
            to='/'
            className='navbar-brand'
            style={{
              fontFamily: '"Kirang Haerang", cursive',
              fontSize: '2em',
              color: '#be9329',
            }}
          >
            BanaHub
          </Link>
          <button
            className='navbar-toggler'
            type='button'
            data-toggle='collapse'
            data-target='#collapsibleNavbar'
          >
            <span className='navbar-toggler-icon' />
          </button>
          <div
            className='collapse navbar-collapse justify-content-end'
            id='collapsibleNavbar'
          >
            <ul className='navbar-nav ml-auto'>
              <li className='nav-item'>
                <Link className='nav-link' to='/'>
                  Trang chủ
                </Link>
              </li>
              <li className='nav-item'>
                <Link className='nav-link' to='#'>
                  Giới thiệu
                </Link>
              </li>
              <li className='nav-item position-relative menu-drop'>
                <div className='nav-link'>Shop</div>

                <div className='nav-menu-drop'>
                  {typeList?.map((item, index) => {
                    return (
                      <>
                        <Link
                          onClick={() => handleSetType(item)}
                          className='nav-link'
                          to={`/store/${item.name}`}
                        >
                          <img
                            className='mr-3'
                            src={item.icon_link}
                            alt=''
                            style={{ width: '24px', height: '24px' }}
                          />
                          {item.name}
                        </Link>
                      </>
                    );
                  })}
                </div>
              </li>
              <li className='nav-item'>
                <Link className='nav-link' to='#'>
                  Tin tức
                </Link>
              </li>
              <li className='nav-item'>
                <Link className='nav-link' to='#'>
                  Liên hệ
                </Link>
              </li>
            </ul>
            <form className='d-flex pl-2' style={{ height: '38px' }}>
              <input className='form-control mr-sm-2' type='text' />
              <Link to='/product' className='btn btn-dark'>
                Search
              </Link>
              <div>
                <div style={{ position: 'relative' }}>
                  {/* {cartItems.length === 0 ? (
                    <Link
                      onClick={() =>
                        alert('Bạn chưa có sản phẩm nào trong giỏ hàng')
                      }
                      className='btn btn-outline-warning'
                      to='/product'
                      style={{
                        padding: '5px 8px',
                        marginLeft: '10px',
                        borderRadius: '50%',
                      }}
                    >
                      <i className='fas fa-shopping-cart' />
                    </Link>
                  ) : (
                    <Link
                      className='btn btn-outline-warning'
                      to='/cart'
                      style={{
                        padding: '5px 8px',
                        marginLeft: '10px',
                        borderRadius: '50%',
                      }}
                    >
                      <i className='fas fa-shopping-cart' />
                    </Link>
                  )} */}
                  <Link
                    className='btn btn-outline-warning'
                    to='/cart'
                    style={{
                      padding: '5px 8px',
                      marginLeft: '10px',
                      borderRadius: '50%',
                    }}
                  >
                    <i className='fas fa-shopping-cart' />
                  </Link>
                  <span
                    className='text-center'
                    style={{
                      fontSize: '.6em',
                      position: 'absolute',
                      width: '15px',
                      height: '15px',
                      borderRadius: '50%',
                      backgroundColor: '#c90000',
                      color: '#fff',
                      transform: 'translateX(-10px)',
                    }}
                  >
                    {cartItems.length}
                  </span>
                </div>
              </div>
            </form>
          </div>
        </nav>
      </div>
    </div>
  );
}
