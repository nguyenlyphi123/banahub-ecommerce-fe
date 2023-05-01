import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';

import './stylesheet/Admin.css';

export default function Employee() {
  return (
    <>
      <div className='container-fluid p-0'>
        <div className='admin-container row m-0'>
          <div className='side-bar navbar bg-dark navbar-dark col-lg-2 pl-0 '>
            <div className='logo navbar-brand d-flex justify-content-center'>
              <Link className='logo-content' to='/employee'>
                <p>Banahub</p>
              </Link>
            </div>

            <div className='side-menu navbar-nav mb-2'>
              <NavLink className='nav-link link' to='invoices'>
                <div className='menu-item nav-item'>
                  <i class='fas fa-box-open'></i>
                  Xử lý đơn hàng
                </div>
              </NavLink>

              <NavLink className='nav-link link' to='warehousing'>
                <div className='menu-item nav-item'>
                  <i class='fas fa-store'></i>
                  Kho hàng
                </div>
              </NavLink>

              <NavLink className='nav-link link' to='engineering'>
                <div className='menu-item nav-item'>
                  <i class='fas fa-tools'></i>
                  Kỹ thuật
                </div>
              </NavLink>

              <NavLink className='nav-link link' to='promotion'>
                <div className='menu-item nav-item'>
                  <i class='fas fa-ticket-alt'></i>
                  Khuyến mãi
                </div>
              </NavLink>

              <NavLink className='nav-link link' to='revenue'>
                <div className='menu-item nav-item'>
                  <i class='fas fa-chart-line'></i>
                  Doanh thu
                </div>
              </NavLink>

              <NavLink className='nav-link link' to='warranty'>
                <div className='menu-item nav-item'>
                  <i class='fas fa-truck-loading'></i>
                  Bảo hành
                </div>
              </NavLink>

              <NavLink className='nav-link link' to='working-schedule'>
                <div className='menu-item nav-item'>
                  <i className='fas fa-file-invoice'></i>
                  Lịch làm việc
                </div>
              </NavLink>
            </div>
          </div>

          <div className='main-content col-lg-10 p-0 pb-2'>
            <div className='top-nav'>
              <div className='tn-content'>
                <div className='login-box dropdown'>
                  <div
                    type='button'
                    className='dropbox dropdown-toggle'
                    data-toggle='dropdown'
                  >
                    <div className='avatar'>
                      <img
                        className='mx-auto d-block'
                        src='https://firebasestorage.googleapis.com/v0/b/banahub.appspot.com/o/images%2Fuser.png?alt=media&token=3f002655-c97b-4022-b601-b24c6e5b901b'
                        alt=''
                      />
                    </div>

                    <div className='name mr-1'>Admin</div>
                  </div>

                  <div className='dropdown-menu'>
                    <h5 className='dropdown-header'>Profile</h5>
                    <div className='dropdown-item'>
                      <i className='fas fa-sign-out-alt mr-2'></i>Sign-out
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='content-container'>
              <div className='admin-content-wrapper'>
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
