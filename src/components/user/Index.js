import React from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from './constantPart/NavBar';
import Footer from './constantPart/Footer';

import './stylesheet/Banahub.css';

export default function Customer() {
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <Outlet />

      {/* Footer */}
      <Footer />
    </>
  );
}
