export interface Players {
  [key: string]: Player;
}

export interface Player {
  currPosition: number;
  snakeBiteCount: number;
  ladderJumpCount: number;
}
