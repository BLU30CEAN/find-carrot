import React from "react";
import styled from "styled-components";
import { GameState } from "../App";

const InfoContainer = styled.div`
  background: #c0c0c0;
  border: 2px solid;
  border-color: #808080 #ffffff #ffffff #808080;
  padding: 8px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  flex-wrap: wrap;
  gap: 8px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 12px;
    padding: 12px;
  }
`;

const Counter = styled.div`
  background: #000000;
  color: #ff0000;
  padding: 4px 8px;
  border: 1px solid #808080;
  font-family: "Digital", monospace;
  font-size: 16px;
  min-width: 60px;
  text-align: center;
  box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.5);

  @media (max-width: 480px) {
    font-size: 14px;
    min-width: 50px;
    padding: 6px 10px;
  }
`;

const ResetButton = styled.button`
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
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
    background: #d0d0d0;
  }

  @media (max-width: 480px) {
    padding: 10px 20px;
    font-size: 16px;
  }
`;

const DifficultySelect = styled.select`
  background: #c0c0c0;
  border: 2px solid;
  border-color: #808080 #ffffff #ffffff #808080;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #000080;
  }

  @media (max-width: 480px) {
    padding: 6px 10px;
    font-size: 14px;
  }
`;

const Timer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 480px) {
    gap: 6px;

    span {
      font-size: 16px;
    }
  }
`;

const ControlsGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  @media (max-width: 480px) {
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const ControlModeButton = styled.button<{ $active: boolean }>`
  background: ${props => props.$active ? '#000080' : '#c0c0c0'};
  color: ${props => props.$active ? '#ffffff' : '#000000'};
  border: 2px solid;
  border-color: #808080 #ffffff #ffffff #808080;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.1s ease;

  &:active {
    border-color: #808080 #ffffff #ffffff #808080;
    transform: translateY(1px);
  }

  &:hover {
    background: ${props => props.$active ? '#000080' : '#d0d0d0'};
  }

  @media (max-width: 480px) {
    padding: 8px 14px;
    font-size: 14px;
  }
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const ControlModesRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 8px;

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

interface GameInfoProps {
  gameState: GameState;
  difficulty: "beginner" | "intermediate" | "expert";
  onReset: () => void;
  onDifficultyChange: (
    difficulty: "beginner" | "intermediate" | "expert"
  ) => void;
  controlMode: "normal" | "flag" | "question";
  onControlModeChange: (mode: "normal" | "flag" | "question") => void;
}

const GameInfo: React.FC<GameInfoProps> = ({
  gameState,
  difficulty,
  onReset,
  onDifficultyChange,
  controlMode,
  onControlModeChange,
}) => {
  const getElapsedTime = () => {
    if (!gameState.startTime) return 0;
    const endTime = gameState.endTime || Date.now();
    return Math.floor((endTime - gameState.startTime) / 1000);
  };

  const getFaceIcon = () => {
    if (gameState.gameWon) return "🐰";
    if (gameState.gameOver) return "😵";
    return "🐰";
  };

  return (
    <InfoContainer>
      <TopRow>
        <Counter>
          {String(gameState.carrotCount - gameState.flagCount).padStart(3, "0")}
        </Counter>

        <ControlsGroup>
          <DifficultySelect
            value={difficulty}
            onChange={(e) => onDifficultyChange(e.target.value as any)}
          >
            <option value="beginner">초급</option>
            <option value="intermediate">중급</option>
            <option value="expert">고급</option>
          </DifficultySelect>

          <ResetButton onClick={onReset}>{getFaceIcon()}</ResetButton>
        </ControlsGroup>

        <Timer>
          <span>⏱️</span>
          <Counter>{String(getElapsedTime()).padStart(3, "0")}</Counter>
        </Timer>
      </TopRow>

      <ControlModesRow>
        <ControlModeButton
          $active={controlMode === "normal"}
          onClick={() => onControlModeChange("normal")}
        >
          👆 일반
        </ControlModeButton>
        <ControlModeButton
          $active={controlMode === "flag"}
          onClick={() => onControlModeChange("flag")}
        >
          🚩 깃발
        </ControlModeButton>
        <ControlModeButton
          $active={controlMode === "question"}
          onClick={() => onControlModeChange("question")}
        >
          ❓ 물음표
        </ControlModeButton>
      </ControlModesRow>
    </InfoContainer>
  );
};

export default GameInfo;
