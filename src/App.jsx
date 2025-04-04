// App.jsx
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from '@/components/Header';
import Page_GameCollection from '@/pages/Page_GameCollection';
import BlockBreaker from '@/GameCollections/BlockBreaker'; // ゲーム本体

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Page_GameCollection />} /> {/* ホーム */}
        <Route path="/blockbreaker" element={<BlockBreaker />} /> {/* ゲーム画面 */}
      </Routes>
    </Router>
  );
}

export default App;

