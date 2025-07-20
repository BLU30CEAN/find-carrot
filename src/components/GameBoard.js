import React from 'react';
import './GameBoard.css';

const GameBoard = ({ 
  board, 
  revealed, 
  flagged, 
  questioned, 
  onCellClick, 
  gameOver, 
  gameWon 
}) => {
  const getCellContent = (row, col) => {
    const cellKey = `${row}-${col}`;
    const isRevealed = revealed.includes(cellKey);
    const isFlagged = flagged.includes(cellKey);
    const isQuestioned = questioned.includes(cellKey);
    const hasCarrot = board[row][col] === 'carrot';

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

    return '';
  };

  const getCellClassName = (row, col) => {
    const cellKey = `${row}-${col}`;
    const isRevealed = revealed.includes(cellKey);
    const isFlagged = flagged.includes(cellKey);
    const isQuestioned = questioned.includes(cellKey);
    const hasCarrot = board[row][col] === 'carrot';

    let className = 'cell';

    if (isFlagged) {
      className += ' flagged';
    } else if (isQuestioned) {
      className += ' questioned';
    } else if (isRevealed) {
      className += ' revealed';
      if (hasCarrot) {
        className += ' carrot';
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