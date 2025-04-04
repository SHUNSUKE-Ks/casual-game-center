
// src/components/GameCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const GameCard = ({ title, image, link }) => {
  return (
    <Link to={link} className="game-card"> {/* ← ここがポイント */}
      <h2 className="game-title">{title}</h2>
      <img src={image} alt={title} className="thumb" />
    </Link>
  );
};

export default GameCard;

