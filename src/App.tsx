import React, { useState } from "react";
import styled from "styled-components";
import GameBoard from "./components/GameBoard";
import GameInfo from "./components/GameInfo";
import { GlobalStyles } from "./styles/GlobalStyles";

const AppContainer = styled.div`
  min-height: 100vh;
  background: #c0c0c0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: "Courier New", monospace;
`;

const GameContainer = styled.div`
  background: #c0c0c0;
  border: 3px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  padding: 10px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h1`
  text-align: center;
  color: #ff6b35;
  font-size: 2rem;
  margin-bottom: 20px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
`;

export interface Cell {
  isCarrot: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  isQuestioned: boolean;
  neighborCarrots: number;
}

export interface GameState {
  board: Cell[][];
  gameOver: boolean;
  gameWon: boolean;
  carrotCount: number;
  flagCount: number;
  startTime: number | null;
  endTime: number | null;
}

const DIFFICULTY_LEVELS = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 },
};

function App() {
  const [difficulty, setDifficulty] = useState<
    "beginner" | "intermediate" | "expert"
  >("beginner");
  const [gameState, setGameState] = useState<GameState>(() =>
    initializeGame(DIFFICULTY_LEVELS.beginner)
  );

  function initializeGame(level: typeof DIFFICULTY_LEVELS.beginner): GameState {
    const { rows, cols, mines } = level;
    const board: Cell[][] = [];

    // 빈 보드 생성
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < cols; j++) {
        board[i][j] = {
          isCarrot: false,
          isRevealed: false,
          isFlagged: false,
          isQuestioned: false,
          neighborCarrots: 0,
        };
      }
    }

    return {
      board,
      gameOver: false,
      gameWon: false,
      carrotCount: mines,
      flagCount: 0,
      startTime: null,
      endTime: null,
    };
  }

  const resetGame = () => {
    setGameState(initializeGame(DIFFICULTY_LEVELS[difficulty]));
  };

  const changeDifficulty = (newDifficulty: typeof difficulty) => {
    setDifficulty(newDifficulty);
    setGameState(initializeGame(DIFFICULTY_LEVELS[newDifficulty]));
  };

  return (
    <>
      <GlobalStyles />
      <AppContainer>
        <Title>🥕 당근찾기</Title>
        <GameContainer>
          <GameInfo
            gameState={gameState}
            difficulty={difficulty}
            onReset={resetGame}
            onDifficultyChange={changeDifficulty}
          />
          <GameBoard
            gameState={gameState}
            setGameState={setGameState}
            difficulty={difficulty}
          />
        </GameContainer>
      </AppContainer>
    </>
  );
}

export default App;
