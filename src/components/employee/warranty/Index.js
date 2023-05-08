import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

import('../stylesheet/Warranty.css');

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
      className='warranty-nav-item'
      onClick={() => onClick(link)}
      to={to}
    >
      {link}
    </Link>
  );
}

export default function Warranty() {
  // customLink
  const [activeLink, setActiveLink] = useState('');

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  return (
    <>
      <div className='warranty-nav-container'>
        <CustomLink
          link='Tiếp nhận bảo hành'
          activeLink={activeLink}
          onClick={handleLinkClick}
          to='/employee/warranty'
        />

        <CustomLink
          link='Đang kiểm tra'
          activeLink={activeLink}
          onClick={handleLinkClick}
          to='/employee/warranty/checking'
        />

        <CustomLink
          link='Chờ vận chuyển'
          activeLink={activeLink}
          onClick={handleLinkClick}
          to='/employee/warranty/transfering'
        />

        <CustomLink
          link='Đã về hàng'
          activeLink={activeLink}
          onClick={handleLinkClick}
          to='/employee/warranty/transfered'
        />

        <CustomLink
          link='Đã hoàn thành'
          activeLink={activeLink}
          onClick={handleLinkClick}
          to='/employee/warranty/complete'
        />
      </div>

      <div className='warranty-container'>
        <Outlet />
      </div>
    </>
  );
}
