import React, { useState, useEffect } from 'react';
import './App.css';
import GameBoard from './components/GameBoard';
import GameInfo from './components/GameInfo';

function App() {
  const [gameState, setGameState] = useState({
    board: [],
    revealed: [],
    flagged: [],
    questioned: [],
    gameOver: false,
    gameWon: false,
    startTime: null,
    elapsedTime: 0,
    totalCarrots: 10,
    remainingFlags: 10
  });

  const [clickMode, setClickMode] = useState('normal'); // 'normal', 'flag', 'question'

  // 게임 초기화
  useEffect(() => {
    initializeGame();
  }, []);

  // 타이머
  useEffect(() => {
    let interval = null;
    if (gameState.startTime && !gameState.gameOver && !gameState.gameWon) {
      interval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          elapsedTime: Math.floor((Date.now() - prev.startTime) / 1000)
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState.startTime, gameState.gameOver, gameState.gameWon]);

  const initializeGame = () => {
    const rows = 10;
    const cols = 10;
    const totalCarrots = 10;
    
    // 빈 보드 생성
    const board = Array(rows).fill().map(() => Array(cols).fill(0));
    
    // 당근 랜덤 배치
    let carrotsPlaced = 0;
    while (carrotsPlaced < totalCarrots) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      if (board[row][col] !== 'carrot') {
        board[row][col] = 'carrot';
        carrotsPlaced++;
      }
    }

    setGameState({
      board,
      revealed: [],
      flagged: [],
      questioned: [],
      gameOver: false,
      gameWon: false,
      startTime: null,
      elapsedTime: 0,
      totalCarrots,
      remainingFlags: totalCarrots
    });
  };

  const handleCellClick = (row, col) => {
    if (gameState.gameOver || gameState.gameWon) return;
    
    // 게임 시작
    if (!gameState.startTime) {
      setGameState(prev => ({ ...prev, startTime: Date.now() }));
    }

    const cellKey = `${row}-${col}`;
    
    if (clickMode === 'flag') {
      handleFlagClick(row, col, cellKey);
    } else if (clickMode === 'question') {
      handleQuestionClick(row, col, cellKey);
    } else {
      handleNormalClick(row, col, cellKey);
    }
  };

  const handleNormalClick = (row, col, cellKey) => {
    // 깃발이나 물음표가 있는 곳은 클릭 불가
    if (gameState.flagged.includes(cellKey) || gameState.questioned.includes(cellKey)) {
      return;
    }

    // 이미 공개된 곳은 클릭 불가
    if (gameState.revealed.includes(cellKey)) {
      return;
    }

    // 당근을 클릭한 경우
    if (gameState.board[row][col] === 'carrot') {
      setGameState(prev => ({
        ...prev,
        gameOver: true,
        revealed: [...prev.revealed, cellKey]
      }));
      return;
    }

    // 빈 공간을 클릭한 경우
    setGameState(prev => ({
      ...prev,
      revealed: [...prev.revealed, cellKey]
    }));

    // 승리 조건 확인
    checkWinCondition();
  };

  const handleFlagClick = (row, col, cellKey) => {
    // 이미 깃발이 있는 경우 제거
    if (gameState.flagged.includes(cellKey)) {
      setGameState(prev => ({
        ...prev,
        flagged: prev.flagged.filter(key => key !== cellKey),
        remainingFlags: prev.remainingFlags + 1
      }));
      return;
    }

    // 깃발이 부족한 경우
    if (gameState.remainingFlags <= 0) {
      alert('깃발이 더 이상 없어요');
      return;
    }

    // 깃발 설치
    setGameState(prev => ({
      ...prev,
      flagged: [...prev.flagged, cellKey],
      remainingFlags: prev.remainingFlags - 1
    }));

    // 승리 조건 확인
    checkWinCondition();
  };

  const handleQuestionClick = (row, col, cellKey) => {
    // 이미 물음표가 있는 경우 제거
    if (gameState.questioned.includes(cellKey)) {
      setGameState(prev => ({
        ...prev,
        questioned: prev.questioned.filter(key => key !== cellKey)
      }));
      return;
    }

    // 물음표 설치
    setGameState(prev => ({
      ...prev,
      questioned: [...prev.questioned, cellKey]
    }));
  };

  const checkWinCondition = () => {
    const allCarrotsFlagged = gameState.board.flat().every((cell, index) => {
      const row = Math.floor(index / 10);
      const col = index % 10;
      const cellKey = `${row}-${col}`;
      
      if (cell === 'carrot') {
        return gameState.flagged.includes(cellKey);
      }
      return true;
    });

    if (allCarrotsFlagged) {
      setGameState(prev => ({ ...prev, gameWon: true }));
    }
  };

  const resetGame = () => {
    initializeGame();
    setClickMode('normal');
  };

  return (
    <div className="App">
      <h1>🥕 당근 찾기 게임</h1>
      
      <GameInfo 
        remainingFlags={gameState.remainingFlags}
        elapsedTime={gameState.elapsedTime}
        clickMode={clickMode}
        setClickMode={setClickMode}
        onReset={resetGame}
      />
      
      <GameBoard 
        board={gameState.board}
        revealed={gameState.revealed}
        flagged={gameState.flagged}
        questioned={gameState.questioned}
        onCellClick={handleCellClick}
        gameOver={gameState.gameOver}
        gameWon={gameState.gameWon}
      />
      
      {gameState.gameOver && (
        <div className="game-over">
          <h2>💥 게임 오버!</h2>
          <p>당근을 건드렸습니다!</p>
          <button onClick={resetGame}>다시 시작</button>
        </div>
      )}
      
      {gameState.gameWon && (
        <div className="game-won">
          <h2>🎉 성공!</h2>
          <div className="dancing-rabbits">
            <div className="rabbit">🐰</div>
            <div className="rabbit">🐰</div>
          </div>
          <p>모든 당근을 찾았습니다!</p>
          <p>소요 시간: {gameState.elapsedTime}초</p>
          <button onClick={resetGame}>다시 시작</button>
        </div>
      )}
    </div>
  );
}

export default App; 