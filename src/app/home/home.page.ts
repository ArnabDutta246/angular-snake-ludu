import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import {
  BothSidePosition,
  IsSnakeOrLadderCell,
  SingleCell,
} from '../interface/cell';
import { DOCUMENT } from '@angular/common';
import { Player, Players } from '../interface/players';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
  numberDice: number = 1;
  currDiceNumber: number = 1;
  players: Players = {
    green: {
      currPosition: 1,
      snakeBiteCount: 0,
      ladderJumpCount: 0,
    },
    red: {
      currPosition: 1,
      snakeBiteCount: 0,
      ladderJumpCount: 0,
    },
  };
  playerTurn: number = 1;
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
    { head: 21, tail: 6 },
  ];

  ladderData: BothSidePosition[] = [
    { tail: 4, head: 17 },
    { tail: 15, head: 25 },
    { tail: 19, head: 29 },
  ];
  showStateBox: boolean = true;
  history = {
    player: 'green',
    alertMsg: 'First turn',
    currPos: 1,
    prevPos: 1,
  };

  reset: boolean = false;
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
    // console.log('all cells table');
    // console.table(this.boxArr);
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

  private ladderDataCheck(cell: number): IsSnakeOrLadderCell {
    let existCell = this.ladderData.filter((ladder) => ladder.tail == cell);
    //console.log(cell, existCell);
    return {
      isLadder: existCell.length > 0 ? true : false,
      ladderAddress: existCell.length > 0 ? existCell[0] : null,
    };
  }

  private snakeDataCheck(cell: number): IsSnakeOrLadderCell {
    let existCell = this.snakeData.filter((snake) => snake.head == cell);
    //console.log(cell, existCell);
    return {
      isSnake: existCell.length > 0 ? true : false,
      snakeAddress: existCell.length > 0 ? existCell[0] : null,
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
        this.currDiceNumber = this.numberDice;
        this.setPlayerPosition(this.playerTurn);
      }
    }, 100);
  }

  private setPlayerPosition(player: number): void {
    let playerActive = player == 1 ? 'green' : 'red';
    if (this.players[playerActive].currPosition + this.numberDice == 36) {
      this.setHistory(
        'You win',
        this.players[playerActive].currPosition,
        this.players[playerActive].currPosition
      );
      this.players[playerActive].currPosition =
        this.players[playerActive].currPosition + this.numberDice;
      this.reset = true;
    } else if (this.players[playerActive].currPosition + this.numberDice > 36) {
      this.playerTurn = this.playerTurn == 1 ? 2 : 1;

      this.setHistory(
        'Ooops!! need ' + (36 - this.players[playerActive].currPosition),
        this.players[playerActive].currPosition,
        this.players[playerActive].currPosition
      );
    } else if (this.players[playerActive].currPosition < 36) {
      this.players[playerActive].currPosition =
        this.players[playerActive].currPosition + this.numberDice;
      this.playerTurn = this.playerTurn == 1 ? 2 : 1;

      this.isSnakeOrLadder(this.players[playerActive], 'snake');
      this.isSnakeOrLadder(this.players[playerActive], 'ladder');
    } else {
      // code
      this.playerTurn = this.playerTurn == 1 ? 2 : 1;
      this.isSnakeOrLadder(this.players[playerActive], 'snake');
      this.isSnakeOrLadder(this.players[playerActive], 'ladder');
    }
  }

  /**
   * check:
   * this player current position has
   * snake/ladder . If so it's next position will
   * @param playerActive
   */
  private isSnakeOrLadder(playerActive: Player, category: string = 'ladder') {
    let findCell = this.boxArr.filter(
      (cell) => cell.cellNumber == playerActive.currPosition
    )[0];

    console.log(findCell);
    if (category == 'snake' && findCell.isSnake) {
      playerActive.currPosition = findCell.snakeAddress.tail;
      playerActive.snakeBiteCount += 1;
      this.setHistory(
        'Oooops!!! Snake bite',
        playerActive.currPosition,
        findCell.snakeAddress.head
      );
    } else if (category == 'ladder' && findCell.isLadder) {
      playerActive.currPosition = findCell.ladderAddress.head;
      playerActive.ladderJumpCount += 1;
      this.setHistory(
        'Coool!!! Ladder Jump',
        playerActive.currPosition,
        findCell.ladderAddress.tail
      );
    } else {
      this.setHistory(
        'Progress',
        playerActive.currPosition,
        Math.abs(playerActive.currPosition - this.currDiceNumber)
      );
    }
  }

  private resetMatch(): void {
    this.reset = !this.reset;
    this.players = {
      green: {
        currPosition: 1,
        snakeBiteCount: 0,
        ladderJumpCount: 0,
      },
      red: {
        currPosition: 1,
        snakeBiteCount: 0,
        ladderJumpCount: 0,
      },
    };
    this.playerTurn = 1;
    this.numberDice = 1;
    this.history = {
      player: 'green',
      alertMsg: 'First turn',
      currPos: 1,
      prevPos: 1,
    };
  }

  private setHistory(msg: string, cPos: number, pPos: number): void {
    this.history = {
      player: this.playerTurn == 1 ? 'red' : 'green',
      alertMsg: msg,
      currPos: cPos,
      prevPos: pPos,
    };
    console.log('Now history', this.history);
  }
}
