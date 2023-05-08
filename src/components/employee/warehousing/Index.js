import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';

import('../stylesheet/Warehousing.css');

function CustomLink({ link, activeLink, onClick, to }) {
  const isActive = link === activeLink;
  const style = isActive
    ? {
        color: 'rgb(255, 77, 33)',
        borderBottom: '3px solid rgb(255, 77, 33)',
      }
    : { color: 'rgba(0, 0, 0, 0.604)' };

  return (
    <Link
      style={style}
      className='warehousing-nav-item col-3'
      onClick={() => onClick(link)}
      to={to}
    >
      {link}
    </Link>
  );
}

export default function Warehousing() {
  // customLink
  const [activeLink, setActiveLink] = useState('');

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  return (
    <>
      <div className='warehousing-nav-container row'>
        <CustomLink
          link='Đơn hàng'
          activeLink={activeLink}
          onClick={handleLinkClick}
          to='/employee/warehousing'
        />

        <CustomLink
          link='Xuất kho'
          activeLink={activeLink}
          onClick={handleLinkClick}
          to='/employee/warehousing/export'
        />

        <CustomLink
          link='Nhập kho'
          activeLink={activeLink}
          onClick={handleLinkClick}
          to='/employee/warehousing/import'
        />

        <CustomLink
          link='Kho hàng'
          activeLink={activeLink}
          onClick={handleLinkClick}
          to='/employee/warehousing/warehouse'
        />
      </div>
      <Outlet />
    </>
  );
}
