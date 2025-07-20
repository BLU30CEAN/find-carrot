export interface GameState {
  board: (string | number)[][];
  revealed: string[];
  flagged: string[];
  questioned: string[];
  gameOver: boolean;
  gameWon: boolean;
  startTime: number | null;
  elapsedTime: number;
  totalCarrots: number;
  remainingFlags: number;
}

export type ClickMode = 'normal' | 'flag' | 'question';

export interface GameBoardProps {
  board: (string | number)[][];
  revealed: string[];
  flagged: string[];
  questioned: string[];
  onCellClick: (row: number, col: number) => void;
  gameOver: boolean;
  gameWon: boolean;
}

export interface GameInfoProps {
  remainingFlags: number;
  elapsedTime: number;
  clickMode: ClickMode;
  setClickMode: (mode: ClickMode) => void;
  onReset: () => void;
} 