// src/pages/Page_Home.jsx
import React from 'react';
import Header from '@/components/Header';
import blockThumbnail from '@/assets/images/thumbnails/blockbreaker_thumb.jpg'; // 仮画像

const Page_Home = () => {
  return (
    <div>
      <Header />
      <main className="gallery">
        <div className="game-card">
          <img src={blockThumbnail} alt="Block Breaker" className="thumb" />
          <h2>ブロック崩し</h2>
          <button disabled>プレイ</button> {/* リンク未設定なので無効化 */}
        </div>
      </main>
    </div>
  );
};

export default Page_Home;
