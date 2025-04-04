import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const BlockBreaker = () => {
  const canvasRef = useRef(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [restartKey, setRestartKey] = useState(0); // canvas強制再描画用

  // ゲームを初期化する関数（再スタート用）
  const resetGame = () => {
    setIsGameOver(false);
    setRestartKey((prev) => prev + 1);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 480;
    canvas.height = 320;

    // ブロック初期状態
    const blockMap = [
      [1, 1, 1, 1, 1, 1, 1],
      [2, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3]
    ];
    const blockWidth = 50;
    const blockHeight = 20;
    const blockPadding = 5;
    const blockOffsetTop = 30;
    const blockOffsetLeft = 10;

    let blocks = blockMap.map((row, rowIndex) =>
      row.map((hp, colIndex) => ({
        x: blockOffsetLeft + colIndex * (blockWidth + blockPadding),
        y: blockOffsetTop + rowIndex * (blockHeight + blockPadding),
        hp
      }))
    );

    // パドル
    const paddleHeight = 10;
    const paddleWidth = 75;
    let paddleX = (canvas.width - paddleWidth) / 2;

    // ボール
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 2;
    let dy = -2;
    const ballRadius = 8;

    // 入力
    let rightPressed = false;
    let leftPressed = false;

    // HPに応じた色
    const getBlockColor = (hp) => {
      switch (hp) {
        case 3: return '#ff5555';
        case 2: return '#ffaa00';
        case 1: return '#88cc00';
        default: return 'transparent';
      }
    };

    // キー入力
    const keyDownHandler = (e) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed = true;
      else if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = true;
    };
    const keyUpHandler = (e) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed = false;
      else if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = false;
    };

    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    // 描画関数たち
    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#0095DD';
      ctx.fill();
      ctx.closePath();
    };

    const drawPaddle = () => {
      ctx.beginPath();
      ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
      ctx.fillStyle = '#0095DD';
      ctx.fill();
      ctx.closePath();
    };

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

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBlocks();
      drawBall();
      drawPaddle();
      collisionDetection();

      // ボール壁反射
      if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
      if (y + dy < ballRadius) dy = -dy;
      else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
          dy = -dy;
        } else {
          setIsGameOver(true); // ゲームオーバー処理
          return; // ループ停止
        }
      }

      x += dx;
      y += dy;

      // パドル移動
      if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 5;
      else if (leftPressed && paddleX > 0) paddleX -= 5;

      requestAnimationFrame(draw);
    };

    draw();

    // クリーンアップ
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
    };
  }, [restartKey]); // restartKeyが変わるたびにゲーム再描画

  return (
    <div style={{ padding: '10px' }}>
      <Link to="/" style={{ display: 'block', marginBottom: '10px' }}>← ホームに戻る</Link>

      {isGameOver && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          💀 ゲームオーバー
          <button onClick={resetGame} style={{ marginLeft: '10px' }}>
            🔁 もう一度プレイ
          </button>
        </div>
      )}

      <canvas
        key={restartKey} // 再スタート時にcanvas再描画
        ref={canvasRef}
        style={{ border: '1px solid #ccc' }}
      />
    </div>
  );
};

export default BlockBreaker;
