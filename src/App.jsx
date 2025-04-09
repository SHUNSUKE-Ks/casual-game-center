// App.jsx
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from '@/components/Header';
import Page_GameCollection from '@/pages/Page_GameCollection';
import BlockBreaker from '@/GameCollections/BlockBreaker'; // ゲーム本体
import BlackJack from '@/GameCollections/BlackJack'; 

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Page_GameCollection />} /> {/* ホーム */}
        <Route path="/blockbreaker" element={<BlockBreaker />} /> {/* ゲーム画面 */}
        <Route path="/blackjack" element={<BlackJack />} /> {/* ← 追加！ */}
      </Routes>
    </Router>
  );
}

export default App;

