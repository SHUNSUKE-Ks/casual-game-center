// BlockBreaker.jsx
// ブロック崩しゲーム本体。Reactとcanvasを使って構築。
// ホームリンク、ゲームオーバー表示、再スタート機能あり。

import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const BlockBreaker = () => {
  // canvasへの参照を保持
  const canvasRef = useRef(null);

  // ゲームオーバー状態を管理
  const [isGameOver, setIsGameOver] = useState(false);

  // canvasを再描画させるためのキー
  const [restartKey, setRestartKey] = useState(0);

  // ゲームの初期化関数（再スタートボタンで呼び出す）
  const resetGame = () => {
    setIsGameOver(false);
    setRestartKey((prev) => prev + 1);
  };

  // useEffect：ゲームの初期化と描画処理
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 480;
    canvas.height = 320;

    // ブロックの配置（行ごとにHPを定義）
    const blockMap = [
      [1, 1, 1, 1, 1, 1, 1],
      [2, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3]
    ];
    const blockWidth = 50;
    const blockHeight = 20;
    const blockPadding = 5;
    const blockOffsetTop = 30;
    const blockOffsetLeft = 10;

    // ブロックの情報をオブジェクトとして整形
    let blocks = blockMap.map((row, rowIndex) =>
      row.map((hp, colIndex) => ({
        x: blockOffsetLeft + colIndex * (blockWidth + blockPadding),
        y: blockOffsetTop + rowIndex * (blockHeight + blockPadding),
        hp
      }))
    );

    // パドルの設定
    const paddleHeight = 10;
    const paddleWidth = 75;
    let paddleX = (canvas.width - paddleWidth) / 2;

    // ボールの初期位置と速度
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 2;
    let dy = -2;
    const ballRadius = 8;

    // キーボード入力状態
    let rightPressed = false;
    let leftPressed = false;

    // ブロックのHPによって色を変える
    const getBlockColor = (hp) => {
      switch (hp) {
        case 3: return '#ff5555'; // 赤
        case 2: return '#ffaa00'; // オレンジ
        case 1: return '#88cc00'; // 緑
        default: return 'transparent';
      }
    };

    // キー押下イベント
    const keyDownHandler = (e) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed = true;
      else if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = true;
    };

    // キー離上イベント
    const keyUpHandler = (e) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed = false;
      else if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = false;
    };

    // キーボードイベントを登録
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    // ボールの描画
    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#0095DD';
      ctx.fill();
      ctx.closePath();
    };

    // パドルの描画
    const drawPaddle = () => {
      ctx.beginPath();
      ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
      ctx.fillStyle = '#0095DD';
      ctx.fill();
      ctx.closePath();
    };

    // ブロックの描画
    const drawBlocks = () => {
      blocks.forEach((row) => {
        row.forEach((block) => {
          if (block.hp > 0) {
            ctx.beginPath();
            ctx.rect(block.x, block.y, blockWidth, blockHeight);
            ctx.fillStyle = getBlockColor(block.hp);
            ctx.fill();
            ctx.closePath();
          }
        });
      });
    };

    // ボールとブロックの当たり判定
    const collisionDetection = () => {
      blocks.forEach((row) => {
        row.forEach((block) => {
          if (
            block.hp > 0 &&
            x > block.x &&
            x < block.x + blockWidth &&
            y > block.y &&
            y < block.y + blockHeight
          ) {
            dy = -dy;
            block.hp -= 1;
          }
        });
      });
    };

    // 描画ループ
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBlocks();
      drawBall();
      drawPaddle();
      collisionDetection();

      // 壁との衝突処理
      if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
      if (y + dy < ballRadius) dy = -dy;
      else if (y + dy > canvas.height - ballRadius) {
        // パドルに当たるかチェック
        if (x > paddleX && x < paddleX + paddleWidth) {
          dy = -dy;
        } else {
          setIsGameOver(true); // パドルに当たらなければゲームオーバー
          return;
        }
      }

      // ボールの移動
      x += dx;
      y += dy;

      // パドルの移動
      if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 5;
      else if (leftPressed && paddleX > 0) paddleX -= 5;

      requestAnimationFrame(draw); // 次フレームで再描画
    };

    draw(); // ゲーム開始

    // コンポーネントがアンマウントされたときにイベント削除
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
    };
  }, [restartKey]); // restartKeyが変わったら再描画

  // 画面描画
  return (
    <div style={{ padding: '10px' }}>
      {/* ホームに戻るリンク */}
      <Link to="/" style={{ display: 'block', marginBottom: '10px' }}>← ホームに戻る</Link>

      {/* ゲームオーバー時の表示と再スタートボタン */}
      {isGameOver && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          💀 ゲームオーバー
          <button onClick={resetGame} style={{ marginLeft: '10px' }}>
            🔁 もう一度プレイ
          </button>
        </div>
      )}

      {/* ゲーム画面（canvas） */}
      <canvas
        key={restartKey} // canvas強制再描画用
        ref={canvasRef}
        style={{ border: '1px solid #ccc' }}
      />
    </div>
  );
};

export default BlockBreaker;
