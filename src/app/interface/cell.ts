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
