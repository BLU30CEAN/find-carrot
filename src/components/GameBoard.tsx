import React from 'react';
import './GameBoard.css';
import { GameBoardProps } from '../types/game';

const GameBoard: React.FC<GameBoardProps> = ({ 
  board, 
  revealed, 
  flagged, 
  questioned, 
  onCellClick, 
  gameOver, 
  gameWon 
}) => {
  const getCellContent = (row: number, col: number): string => {
    const cellKey = `${row}-${col}`;
    const isRevealed = revealed.includes(cellKey);
    const isFlagged = flagged.includes(cellKey);
    const isQuestioned = questioned.includes(cellKey);
    const hasCarrot = board[row][col] === 'carrot';
    const neighborCount = board[row][col];

    if (isFlagged) {
      return '🚩';
    }

    if (isQuestioned) {
      return '❓';
    }

    if (!isRevealed) {
      return '';
    }

    if (hasCarrot) {
      return '🥕';
    }

    // 주변 당근 개수 표시
    if (typeof neighborCount === 'number' && neighborCount > 0) {
      return neighborCount.toString();
    }

    return '';
  };

  const getCellClassName = (row: number, col: number): string => {
    const cellKey = `${row}-${col}`;
    const isRevealed = revealed.includes(cellKey);
    const isFlagged = flagged.includes(cellKey);
    const isQuestioned = questioned.includes(cellKey);
    const hasCarrot = board[row][col] === 'carrot';
    const neighborCount = board[row][col];

    let className = 'cell';

    if (isFlagged) {
      className += ' flagged';
    } else if (isQuestioned) {
      className += ' questioned';
    } else if (isRevealed) {
      className += ' revealed';
      if (hasCarrot) {
        className += ' carrot';
      } else if (typeof neighborCount === 'number' && neighborCount > 0) {
        className += ` neighbor-${neighborCount}`;
      }
    }

    if (gameOver && hasCarrot) {
      className += ' exploded';
    }

    return className;
  };

  return (
    <div className="game-board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={getCellClassName(rowIndex, colIndex)}
              onClick={() => onCellClick(rowIndex, colIndex)}
              disabled={gameOver || gameWon}
            >
              {getCellContent(rowIndex, colIndex)}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard; 