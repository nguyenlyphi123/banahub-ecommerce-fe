import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <div
      className='container-fluid container-center d-flex justify-content-center'
      style={{ padding: '2rem', marginTop: '3rem', backgroundColor: '#be9329' }}
    >
      <div className='sub-container' style={{ width: '70%' }}>
        <div className='row'>
          <div className='col-sm-6 col-md-3 col-lg-3'>
            <h7 className='footer-brand'>Menu</h7>
            <div className='d-flex flex-column'>
              <Link className='footer-content' to=''>
                Giới thiệu
              </Link>
              <Link className='footer-content' to='/product'>
                Cửa hàng
              </Link>
              <Link className='footer-content' to=''>
                Liên hệ
              </Link>
            </div>
          </div>
          <div className='col-sm-6 col-md-3 col-lg-3'>
            <h7 className='footer-brand'>Tài khoản</h7>
            <div className='d-flex flex-column'>
              <Link className='footer-content' to='/myaccount'>
                My account
              </Link>
              <Link className='footer-content' to='/myaccount'>
                Kiểm tra đơn hàng
              </Link>
              <Link className='footer-content' to>
                Thanh toán
              </Link>
              {/* {cartItems.length === 0 ? (
                <Link
                  onClick={() =>
                    alert('Bạn chưa có sản phẩm nào trong giỏ hàng')
                  }
                  className='footer-content'
                  to='/product'
                >
                  Giỏ hàng
                </Link>
              ) : (
                <Link className='footer-content' to='/cart'>
                  Giỏ hàng
                </Link>
              )} */}
              <Link className='footer-content' to='/cart'>
                Giỏ hàng
              </Link>
            </div>
          </div>
          <div className='col-sm-6 col-md-3 col-lg-3'>
            <h7 className='footer-brand'>Dịch vụ</h7>
            <div className='d-flex flex-column'>
              <Link className='footer-content' to='#'>
                Giới thiệu
              </Link>
              <Link className='footer-content' to='/product'>
                Cửa hàng
              </Link>
              <Link className='footer-content' to='#'>
                Liên hệ
              </Link>
            </div>
          </div>
          <div className='col-sm-6 col-md-3 col-lg-3'>
            <h7 className='footer-brand'>Đăng ký</h7>
            <p style={{ color: 'rgb(223, 223, 223)', paddingBottom: '.5rem' }}>
              Đăng ký để nhận được thông tin mới nhất từ chúng tôi.
            </p>
            <Link
              to='/register'
              className='btn btn-light pl-5 pr-5'
              style={{ color: 'rgb(190, 147, 41)' }}
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
