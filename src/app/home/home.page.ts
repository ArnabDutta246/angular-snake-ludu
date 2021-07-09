import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { BothSidePosition, SingleCell } from '../interface/cell';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
  numberDice: number = 1;
  players = {
    green: {
      currPosition: 1,
    },
    red: {
      currPosition: 1,
    },
  };
  playerTurn: number = 1;
  currPosition: number = 16;
  colors = [
    'colorYellowGreen',
    'colorGreenYellow ',
    'colorYellow ',
    'colorRed',
    'colorBlue',
    'colorOrange',
  ];
  boxArr: SingleCell[] = [];
  snakeData: BothSidePosition[] = [
    { head: 34, tail: 22 },
    { head: 13, tail: 10 },
    { tail: 21, head: 6 },
  ];

  ladderData: BothSidePosition[] = [
    { tail: 4, head: 17 },
    { tail: 15, head: 25 },
    { tail: 19, head: 29 },
  ];
  constructor(@Inject(DOCUMENT) document) {}
  ngOnInit() {
    this.createMainArr();
  }
  ngAfterViewInit() {}

  private createMainArr(): void {
    let rowIndex: number = 1;
    let nextBreak: number = 6; //12
    let max: number = 36;
    let count: number = 5;
    for (let i = 1; i <= nextBreak; i++) {
      if (i == nextBreak && nextBreak != max) {
        this.boxSynchronize(rowIndex, i, count);
        nextBreak = nextBreak + 6;
        count = 5;
        rowIndex = rowIndex + 1;
      } else {
        this.boxSynchronize(rowIndex, i, count);
        count = count - 2;
      }
    }
    this.boxArr = this.boxArr.reverse();
    console.log('array', this.boxArr);
  }

  private rendomNumber(minNumber: number = 0, maxNumber: number = 5): number {
    let j;
    let min = minNumber;
    let max = maxNumber;
    let i = Math.floor(Math.random() * (max - min)) + min;
    if (j === i) {
      i = this.rendomNumber();
    }
    j = i;
    return i;
  }

  private boxSynchronize(rowIndex: number, currNumber: number, count: number) {
    let redomIndex: number = this.rendomNumber();
    let cell: number =
      rowIndex == 1
        ? currNumber
        : rowIndex % 2 == 0
        ? currNumber + count
        : currNumber;
    let cellData: SingleCell = {
      cellNumber: cell,
      color: this.colors[redomIndex],
      ...this.ladderDataCheck(cell),
      ...this.snakeDataCheck(cell),
    };
    this.boxArr.push(cellData);
  }

  private ladderDataCheck(cell: number) {
    let existCell = this.ladderData.filter((ladder) => ladder.tail == cell);
    //console.log(cell, existCell);
    return {
      isLadder: existCell.length > 0 ? true : false,
      ...existCell[0],
    };
  }

  private snakeDataCheck(cell: number) {
    let existCell = this.snakeData.filter((ladder) => ladder.head == cell);
    //console.log(cell, existCell);
    return {
      isSnake: existCell.length > 0 ? true : false,
      ...existCell[0],
    };
  }

  /**
   * roleDice
   */
  private roleDice(): void {
    let count = 0;
    let interval = setInterval(() => {
      if (count != 12) {
        this.numberDice = this.rendomNumber(1, 6);
        count++;
      } else {
        clearInterval(interval);
        this.setPlayerPosition(this.playerTurn);
      }
    }, 100);
  }

  private setPlayerPosition(player: number): void {
    let playerActive = player == 1 ? 'green' : 'red';
    if (this.players[playerActive].currPosition + this.numberDice == 36) {
      alert('You win');
    } else if (this.players[playerActive].currPosition + this.numberDice > 36) {
      this.playerTurn = this.playerTurn == 1 ? 2 : 1;
      alert('Ooops!! try another round');
    } else if (this.players[playerActive].currPosition < 36) {
      this.players[playerActive].currPosition =
        this.players[playerActive].currPosition + this.numberDice;
      this.playerTurn = this.playerTurn == 1 ? 2 : 1;
    } else {
      // code
      this.playerTurn = this.playerTurn == 1 ? 2 : 1;
    }
  }

  private isSnakeOrLadder() {}
}
