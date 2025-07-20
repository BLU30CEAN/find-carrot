import React, { useState, useEffect } from 'react';
import './App.css';
import GameBoard from './components/GameBoard';
import GameInfo from './components/GameInfo';
import { GameState, ClickMode } from './types/game';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
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

  const [clickMode, setClickMode] = useState<ClickMode>('normal');

  // 게임 초기화
  useEffect(() => {
    initializeGame();
  }, []);

  // 타이머
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (gameState.startTime && !gameState.gameOver && !gameState.gameWon) {
      interval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          elapsedTime: Math.floor((Date.now() - (prev.startTime || 0)) / 1000)
        }));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.startTime, gameState.gameOver, gameState.gameWon]);

  const initializeGame = (): void => {
    const rows = 10;
    const cols = 10;
    const totalCarrots = 10;
    
    // 빈 보드 생성
    const board: (string | number)[][] = Array(rows).fill(null).map(() => Array(cols).fill(0));
    
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

    // 주변 당근 개수 계산
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (board[row][col] !== 'carrot') {
          let count = 0;
          // 8방향 체크
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const newRow = row + dr;
              const newCol = col + dc;
              if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                if (board[newRow][newCol] === 'carrot') {
                  count++;
                }
              }
            }
          }
          board[row][col] = count;
        }
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

  const handleCellClick = (row: number, col: number): void => {
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

  const handleNormalClick = (row: number, col: number, cellKey: string): void => {
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

    // 빈 공간을 클릭한 경우 - 주변 자동 공개
    const newRevealed = new Set([...gameState.revealed, cellKey]);
    revealAdjacentCells(row, col, newRevealed);

    setGameState(prev => ({
      ...prev,
      revealed: Array.from(newRevealed)
    }));

    // 승리 조건 확인
    checkWinCondition();
  };

  const revealAdjacentCells = (row: number, col: number, revealedSet: Set<string>): void => {
    const rows = gameState.board.length;
    const cols = gameState.board[0].length;
    
    // 현재 셀이 0인 경우에만 주변 셀들을 공개
    if (gameState.board[row][col] === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const newRow = row + dr;
          const newCol = col + dc;
          const newCellKey = `${newRow}-${newCol}`;
          
          if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
            // 이미 공개되었거나 깃발/물음표가 있는 경우 스킵
            if (revealedSet.has(newCellKey) || 
                gameState.flagged.includes(newCellKey) || 
                gameState.questioned.includes(newCellKey)) {
              continue;
            }
            
            revealedSet.add(newCellKey);
            
            // 주변 셀도 0이면 재귀적으로 공개
            if (gameState.board[newRow][newCol] === 0) {
              revealAdjacentCells(newRow, newCol, revealedSet);
            }
          }
        }
      }
    }
  };

  const handleFlagClick = (row: number, col: number, cellKey: string): void => {
    // 이미 공개된 곳에는 깃발 설치 불가
    if (gameState.revealed.includes(cellKey)) {
      return;
    }

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

  const handleQuestionClick = (row: number, col: number, cellKey: string): void => {
    // 이미 공개된 곳에는 물음표 설치 불가
    if (gameState.revealed.includes(cellKey)) {
      return;
    }

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

  const checkWinCondition = (): void => {
    let allCarrotsFlagged = true;
    let carrotCount = 0;
    let flaggedCarrotCount = 0;
    let flaggedNonCarrotCount = 0;
    
    for (let row = 0; row < gameState.board.length; row++) {
      for (let col = 0; col < gameState.board[row].length; col++) {
        const cell = gameState.board[row][col];
        const cellKey = `${row}-${col}`;
        
        if (cell === 'carrot') {
          carrotCount++;
          if (gameState.flagged.includes(cellKey)) {
            flaggedCarrotCount++;
          } else {
            allCarrotsFlagged = false;
          }
        } else if (gameState.flagged.includes(cellKey)) {
          flaggedNonCarrotCount++;
        }
      }
    }

    console.log(`총 당근: ${carrotCount}, 깃발 꽂힌 당근: ${flaggedCarrotCount}, 잘못 꽂힌 깃발: ${flaggedNonCarrotCount}, 승리: ${allCarrotsFlagged}`);

    // 모든 당근에 깃발이 꽂혀있으면 승리 (잘못 꽂힌 깃발 허용)
    if (allCarrotsFlagged) {
      setGameState(prev => ({ ...prev, gameWon: true }));
    }
  };

  const resetGame = (): void => {
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
};

export default App; 