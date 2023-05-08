import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

import '../stylesheet/Invoice-Requirement.css';

function CustomLink({ link, activeLink, onClick, to }) {
  const isActive = link === activeLink;
  const style = isActive
    ? {
        borderBottom: '3px solid rgb(255, 77, 33)',
        color: 'rgb(255, 77, 33)',
      }
    : { color: 'rgba(0, 0, 0, 0.604)' };

  return (
    <Link
      style={style}
      to={to}
      className='invoices-nav-item col-4'
      onClick={() => onClick(link)}
    >
      {link}
    </Link>
  );
}

export default function InvoiceRequirement() {
  const [activeLink, setActiveLink] = useState('');

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  return (
    <>
      <div className='invoices-nav-container row'>
        <CustomLink
          link='Chưa xử lý'
          activeLink={activeLink}
          onClick={handleLinkClick}
          to='/employee/invoices'
        />

        <CustomLink
          link='Đang xử lý'
          activeLink={activeLink}
          onClick={handleLinkClick}
          to='/employee/invoices/processed'
        />

        <CustomLink
          link='Đã xử lý'
          activeLink={activeLink}
          onClick={handleLinkClick}
          to='/employee/invoices/complete'
        />
      </div>

      <div className='invoices-container'>
        <Outlet />
      </div>
    </>
  );
}
