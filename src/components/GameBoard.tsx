import React, { useEffect, useCallback, useState } from "react";
import styled from "styled-components";
import { GameState, Cell } from "../App";

const BoardContainer = styled.div`
  display: inline-block;
  background: #c0c0c0;
  border: 3px solid;
  border-color: #808080 #ffffff #ffffff #808080;
  padding: 4px;
`;

const BoardGrid = styled.div<{ cols: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.cols}, 24px);
  gap: 0;
  background: #c0c0c0;
`;

const CellButton = styled.button<{
  isRevealed: boolean;
  isFlagged: boolean;
  isQuestioned: boolean;
  neighborCarrots: number;
  isCarrot: boolean;
  gameOver: boolean;
}>`
  width: 24px;
  height: 24px;
  border: 1px solid;
  border-color: ${(props) =>
    props.isRevealed ? "#808080" : "#ffffff #808080 #808080 #ffffff"};
  background: ${(props) => {
    if (props.isRevealed) {
      if (props.isCarrot) return "#ff6b35";
      return "#c0c0c0";
    }
    return "#c0c0c0";
  }};
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.1s ease;
  color: ${(props) => {
    if (!props.isRevealed) return "transparent";
    if (props.isCarrot) return "#000000";
    const colors = [
      "",
      "#0000ff",
      "#008200",
      "#ff0000",
      "#000084",
      "#840000",
      "#008284",
      "#840084",
      "#757575",
    ];
    return colors[props.neighborCarrots] || "#000000";
  }};

  &:active {
    ${(props) =>
      !props.isRevealed &&
      `
      border-color: #808080 #ffffff #ffffff #808080;
      transform: translateY(1px);
    `}
  }

  &:hover {
    ${(props) =>
      !props.isRevealed &&
      `
      background: #d0d0d0;
    `}
  }

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
`;

const Controls = styled.div`
  display: flex;
  margin: 20px 0;
  gap: 10px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const ControlButton = styled.button<{ isActive?: boolean }>`
  background: ${(props) => (props.isActive ? "#000080" : "#c0c0c0")};
  color: ${(props) => (props.isActive ? "#ffffff" : "#000000")};
  border: 2px solid;
  border-color: #808080 #ffffff #ffffff #808080;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.1s ease;

  &:active {
    border-color: #808080 #ffffff #ffffff #808080;
    transform: translateY(1px);
  }

  &:hover {
    background: ${(props) => (props.isActive ? "#000080" : "#d0d0d0")};
  }
`;

interface GameBoardProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  difficulty: "beginner" | "intermediate" | "expert";
}

const DIFFICULTY_LEVELS = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 },
};

const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  setGameState,
  difficulty,
}) => {
  const { rows, cols } = DIFFICULTY_LEVELS[difficulty];
  const [controlMode, setControlMode] = useState<
    "normal" | "flag" | "question"
  >("normal");

  // 당근 배치 함수
  const placeCarrots = useCallback(
    (firstRow: number, firstCol: number) => {
      const newBoard = [...gameState.board];
      const carrots = DIFFICULTY_LEVELS[difficulty].mines;
      let placedCarrots = 0;

      while (placedCarrots < carrots) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);

        // 첫 번째 클릭한 셀과 그 주변에는 당근을 배치하지 않음
        if (
          !newBoard[row][col].isCarrot &&
          (Math.abs(row - firstRow) > 1 || Math.abs(col - firstCol) > 1)
        ) {
          newBoard[row][col].isCarrot = true;
          placedCarrots++;
        }
      }

      // 이웃 당근 수 계산
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (!newBoard[i][j].isCarrot) {
            let count = 0;
            for (let di = -1; di <= 1; di++) {
              for (let dj = -1; dj <= 1; dj++) {
                const ni = i + di;
                const nj = j + dj;
                if (
                  ni >= 0 &&
                  ni < rows &&
                  nj >= 0 &&
                  nj < cols &&
                  newBoard[ni][nj].isCarrot
                ) {
                  count++;
                }
              }
            }
            newBoard[i][j].neighborCarrots = count;
          }
        }
      }

      return newBoard;
    },
    [gameState.board, difficulty, rows, cols]
  );

  // 깃발 클릭 처리
  const handleFlagClick = useCallback(
    (row: number, col: number) => {
      if (
        gameState.gameOver ||
        gameState.gameWon ||
        gameState.board[row][col].isRevealed
      ) {
        return;
      }

      setGameState((prevState) => {
        const newBoard = [...prevState.board];
        const cell = newBoard[row][col];

        // 물음표가 있으면 제거하고 깃발로 변경
        if (cell.isQuestioned) {
          cell.isQuestioned = false;
          cell.isFlagged = true;
        } else {
          // 깃발 토글
          cell.isFlagged = !cell.isFlagged;
        }

        return {
          ...prevState,
          board: newBoard,
          flagCount: prevState.flagCount + (cell.isFlagged ? 1 : -1),
        };
      });
    },
    [gameState, setGameState]
  );

  // 물음표 클릭 처리
  const handleQuestionClick = useCallback(
    (row: number, col: number) => {
      if (
        gameState.gameOver ||
        gameState.gameWon ||
        gameState.board[row][col].isRevealed
      ) {
        return;
      }

      setGameState((prevState) => {
        const newBoard = [...prevState.board];
        const cell = newBoard[row][col];

        // 깃발이 있으면 제거하고 물음표로 변경
        if (cell.isFlagged) {
          cell.isFlagged = false;
          cell.isQuestioned = true;
          return {
            ...prevState,
            board: newBoard,
            flagCount: prevState.flagCount - 1,
          };
        }

        // 물음표 토글
        cell.isQuestioned = !cell.isQuestioned;
        return {
          ...prevState,
          board: newBoard,
        };
      });
    },
    [gameState, setGameState]
  );

  // 일반 클릭 처리
  const handleNormalClick = useCallback(
    (row: number, col: number) => {
      if (
        gameState.gameOver ||
        gameState.gameWon ||
        gameState.board[row][col].isRevealed ||
        gameState.board[row][col].isFlagged ||
        gameState.board[row][col].isQuestioned
      ) {
        return;
      }

      setGameState((prevState) => {
        const newBoard = [...prevState.board];
        const cell = newBoard[row][col];

        // 첫 번째 클릭인 경우 당근 배치
        if (!prevState.startTime) {
          const boardWithCarrots = placeCarrots(row, col);
          newBoard.splice(0, newBoard.length, ...boardWithCarrots);
          newBoard[row][col].isRevealed = true;
        } else {
          newBoard[row][col].isRevealed = true;
        }

        // 당근을 클릭한 경우 게임 오버
        if (newBoard[row][col].isCarrot) {
          for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
              if (newBoard[i][j].isCarrot) {
                newBoard[i][j].isRevealed = true;
              }
            }
          }
          return {
            ...prevState,
            board: newBoard,
            gameOver: true,
            endTime: Date.now(),
          };
        }

        // 빈 셀이면 주변 확장
        if (newBoard[row][col].neighborCarrots === 0) {
          const revealEmptyCells = (r: number, c: number) => {
            for (let di = -1; di <= 1; di++) {
              for (let dj = -1; dj <= 1; dj++) {
                const ni = r + di;
                const nj = c + dj;
                if (
                  ni >= 0 &&
                  ni < rows &&
                  nj >= 0 &&
                  nj < cols &&
                  !newBoard[ni][nj].isRevealed &&
                  !newBoard[ni][nj].isFlagged &&
                  !newBoard[ni][nj].isQuestioned
                ) {
                  newBoard[ni][nj].isRevealed = true;
                  if (newBoard[ni][nj].neighborCarrots === 0) {
                    revealEmptyCells(ni, nj);
                  }
                }
              }
            }
          };
          revealEmptyCells(row, col);
        }

        // 승리 조건 확인
        const revealedCount = newBoard
          .flat()
          .filter((cell) => cell.isRevealed && !cell.isCarrot).length;
        const totalCells = rows * cols - DIFFICULTY_LEVELS[difficulty].mines;

        if (revealedCount === totalCells) {
          return {
            ...prevState,
            board: newBoard,
            gameWon: true,
            endTime: Date.now(),
          };
        }

        return {
          ...prevState,
          board: newBoard,
        };
      });
    },
    [gameState, setGameState, placeCarrots, rows, cols, difficulty]
  );

  // 셀 클릭 처리 (컨트롤 모드에 따라)
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (gameState.gameOver || gameState.gameWon) {
        return;
      }

      const cell = gameState.board[row][col];

      // 이미 공개된 셀은 클릭 무시
      if (cell.isRevealed) {
        return;
      }

      // 컨트롤 모드에 따른 처리
      switch (controlMode) {
        case "normal":
          handleNormalClick(row, col);
          break;
        case "flag":
          handleFlagClick(row, col);
          break;
        case "question":
          handleQuestionClick(row, col);
          break;
      }
    },
    [gameState, controlMode, handleNormalClick, handleFlagClick, handleQuestionClick]
  );

  // 게임 시작 시간 설정
  useEffect(() => {
    if (!gameState.startTime && !gameState.gameOver && !gameState.gameWon) {
      const hasRevealedCells = gameState.board.some((row) =>
        row.some((cell) => cell.isRevealed)
      );
      if (hasRevealedCells) {
        setGameState((prev) => ({ ...prev, startTime: Date.now() }));
      }
    }
  }, [
    gameState.board,
    gameState.startTime,
    gameState.gameOver,
    gameState.gameWon,
    setGameState,
  ]);

  const getCellContent = (cell: Cell) => {
    if (cell.isFlagged) return "🚩";
    if (cell.isQuestioned) return "❓";
    if (!cell.isRevealed) return "";
    if (cell.isCarrot) return "🥕";
    if (cell.neighborCarrots === 0) return "";
    return cell.neighborCarrots.toString();
  };

  return (
    <>
      <BoardContainer>
        <BoardGrid cols={cols}>
          {gameState.board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <CellButton
                key={`${rowIndex}-${colIndex}`}
                isRevealed={cell.isRevealed}
                isFlagged={cell.isFlagged}
                isQuestioned={cell.isQuestioned}
                neighborCarrots={cell.neighborCarrots}
                isCarrot={cell.isCarrot}
                gameOver={gameState.gameOver}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {getCellContent(cell)}
              </CellButton>
            ))
          )}
        </BoardGrid>
      </BoardContainer>

      <Controls>
        <ControlButton
          isActive={controlMode === "normal"}
          onClick={() => setControlMode("normal")}
        >
          👆 일반
        </ControlButton>
        <ControlButton
          isActive={controlMode === "flag"}
          onClick={() => setControlMode("flag")}
        >
          🚩 깃발
        </ControlButton>
        <ControlButton
          isActive={controlMode === "question"}
          onClick={() => setControlMode("question")}
        >
          ❓ 물음표
        </ControlButton>
      </Controls>
    </>
  );
};

export default GameBoard;
