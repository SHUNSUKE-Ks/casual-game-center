// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // ← 追加！
import logo from '@/assets/images/icons/logo.png'; // logo画像が存在する必要あり

const Header = () => {
  return (
    <header className="header">
         <Link to="/"> {/* ← ロゴにリンクを追加！ */}
      <img src={logo} alt="Logo" className="logo" />
    </Link>
    </header>
  );
};

export default Header;
