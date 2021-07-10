export interface SingleCell {
  cellNumber: number;
  color: string;
  isSnake?: boolean;
  snakeAddress?: BothSidePosition;
  isLadder?: boolean;
  ladderAddress?: BothSidePosition;
}

export interface BothSidePosition {
  head: number;
  tail: number;
}

export interface IsSnakeOrLadderCell {
  isSnake?: boolean;
  isLadder?: boolean;
  snakeAddress?: BothSidePosition;
  ladderAddress?: BothSidePosition;
}
