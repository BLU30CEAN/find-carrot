import React from 'react';
import './GameInfo.css';
import { GameInfoProps } from '../types/game';

const GameInfo: React.FC<GameInfoProps> = ({ 
  remainingFlags, 
  elapsedTime, 
  clickMode, 
  setClickMode, 
  onReset 
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-info">
      <div className="info-row">
        <div className="info-item">
          <span className="label">🚩 깃발:</span>
          <span className="value">{remainingFlags}</span>
        </div>
        <div className="info-item">
          <span className="label">⏱️ 시간:</span>
          <span className="value">{formatTime(elapsedTime)}</span>
        </div>
      </div>
      
      <div className="control-row">
        <div className="click-mode-controls">
          <button 
            className={`mode-btn ${clickMode === 'normal' ? 'active' : ''}`}
            onClick={() => setClickMode('normal')}
          >
            👆 일반
          </button>
          <button 
            className={`mode-btn ${clickMode === 'flag' ? 'active' : ''}`}
            onClick={() => setClickMode('flag')}
          >
            🚩 깃발
          </button>
          <button 
            className={`mode-btn ${clickMode === 'question' ? 'active' : ''}`}
            onClick={() => setClickMode('question')}
          >
            ❓ 물음표
          </button>
        </div>
        
        <button className="reset-btn" onClick={onReset}>
          🔄 새 게임
        </button>
      </div>
    </div>
  );
};

export default GameInfo; 