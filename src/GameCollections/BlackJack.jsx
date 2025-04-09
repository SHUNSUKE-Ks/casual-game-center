// BlackJack.jsx
// 📌 ブラックジャックの簡易実装ファイル（JSX + スタイル）
// - ゲームのロジックは1ファイルに集約
// - 画像素材なし。UIはすべてコード描画
// - ギャラリーから遷移して表示される

import React, { useState } from 'react';

// ♠ トランプカード生成
const createDeck = () => {
  const suits = ['♠', '♣', '♥', '♦'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck = [];

  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
  return deck.sort(() => Math.random() - 0.5); // ランダムシャッフル
};

// ♠ 数値計算（Aは1または11）
const getCardValue = (card) => {
  const { value } = card;
  if (['J', 'Q', 'K'].includes(value)) return 10;
  if (value === 'A') return 11; // 初期は11として扱う（後で調整）
  return parseInt(value);
};

const calculateScore = (hand) => {
  let score = 0;
  let aces = 0;

  for (let card of hand) {
    score += getCardValue(card);
    if (card.value === 'A') aces++;
  }

  // Aが複数ある場合に21を超えたら1としてカウント
  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }

  return score;
};

const BlackJack = () => {
  const [deck, setDeck] = useState(createDeck());
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [result, setResult] = useState('');

  // ♠ 初期化（ゲーム開始）
  const startGame = () => {
    const newDeck = createDeck();
    const player = [newDeck.pop(), newDeck.pop()];
    const dealer = [newDeck.pop(), newDeck.pop()];
    setDeck(newDeck);
    setPlayerHand(player);
    setDealerHand(dealer);
    setIsGameOver(false);
    setResult('');
  };

  // ♠ ヒット（カードを引く）
  const hit = () => {
    if (isGameOver) return;
    const newDeck = [...deck];
    const newCard = newDeck.pop();
    const newHand = [...playerHand, newCard];
    setPlayerHand(newHand);
    setDeck(newDeck);

    if (calculateScore(newHand) > 21) {
      setIsGameOver(true);
      setResult('Bust! You lose!');
    }
  };

  // ♠ スタンド（ディーラーのターン）
  const stand = () => {
    let newDeck = [...deck];
    let newDealerHand = [...dealerHand];

    while (calculateScore(newDealerHand) < 17) {
      newDealerHand.push(newDeck.pop());
    }

    const playerScore = calculateScore(playerHand);
    const dealerScore = calculateScore(newDealerHand);

    let outcome = '';
    if (dealerScore > 21 || playerScore > dealerScore) {
      outcome = 'You win!';
    } else if (dealerScore === playerScore) {
      outcome = 'Draw!';
    } else {
      outcome = 'You lose!';
    }

    setDeck(newDeck);
    setDealerHand(newDealerHand);
    setIsGameOver(true);
    setResult(outcome);
  };

  return (
    <div style={styles.container}>
      <h1>🃏 BlackJack</h1>
      <p>Try to get as close to 21 as possible without going over.</p>

      <div style={styles.section}>
        <h2>Dealer</h2>
        <div style={styles.cardRow}>
          {dealerHand.map((card, index) => (
            <div key={index} style={styles.card}>
              {isGameOver || index === 0 ? `${card.value}${card.suit}` : '🂠'}
            </div>
          ))}
        </div>
        {isGameOver && <p>Score: {calculateScore(dealerHand)}</p>}
      </div>

      <div style={styles.section}>
        <h2>You</h2>
        <div style={styles.cardRow}>
          {playerHand.map((card, index) => (
            <div key={index} style={styles.card}>
              {`${card.value}${card.suit}`}
            </div>
          ))}
        </div>
        <p>Score: {calculateScore(playerHand)}</p>
      </div>

      <div style={styles.controls}>
        {!playerHand.length ? (
          <button onClick={startGame}>Start Game</button>
        ) : !isGameOver ? (
          <>
            <button onClick={hit}>Hit</button>
            <button onClick={stand}>Stand</button>
          </>
        ) : (
          <button onClick={startGame}>Play Again</button>
        )}
      </div>

      {result && <h2>{result}</h2>}
    </div>
  );
};

// ♠ 簡易スタイル（インライン）
const styles = {
  container: {
    textAlign: 'center',
    fontFamily: 'sans-serif',
    padding: '20px',
  },
  section: {
    margin: '20px 0',
  },
  cardRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  card: {
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '10px 14px',
    backgroundColor: '#fff',
    fontSize: '18px',
    minWidth: '40px',
  },
  controls: {
    margin: '20px',
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
};

export default BlackJack;

