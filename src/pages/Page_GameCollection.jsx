// src/pages/Page_GameCollection.jsx
import React from 'react';
import GameCard from '@/components/GameCard';
import blockImage from '@/assets/images/thumbnails/blockbreaker_thumb.png';

const Page_GameCollection = () => {
  return (
    <main className="gallery">
      <GameCard
        title="ブロック崩し"
        image={blockImage}
        link="/blockbreaker" // ← ルートをここに
      />
    </main>
  );
};

export default Page_GameCollection;
