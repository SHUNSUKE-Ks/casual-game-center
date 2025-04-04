// src/components/Header.jsx
import React from 'react';
import logo from '@/assets/images/icons/logo.png'; // logo画像が存在する必要あり

const Header = () => {
  return (
    <header className="header">
      <img src={logo} alt="Logo" className="logo" />
    </header>
  );
};

export default Header;
