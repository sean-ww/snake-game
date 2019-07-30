// Based upon https://github.com/ilyagru/Space-Snake

import keyCode from './keyCode.constants';
import { CellInterface } from './Game.interfaces';

class Part {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class Snake {
  public x: number;
  public y: number;
  public parts: Part[];
  protected game: GameLogic;
  protected xSpeed: number;
  protected ySpeed: number;
  protected canChange: boolean;

  constructor(game: GameLogic) {
    this.game = game;
    this.x = 12;
    this.y = 12;
    this.xSpeed = 0;
    this.ySpeed = 1;
    this.canChange = true;
    this.parts = [
      new Part(12, 12),
      new Part(12, 11),
      new Part(12, 10),
      new Part(11, 10),
      new Part(10, 10),
      new Part(9, 10),
      new Part(8, 10),
    ];
  }

  controller(key: number): void {
    if (key === keyCode.ARROW_LEFT && this.ySpeed !== 0 && this.canChange) {
      this.canChange = false;
      this.xSpeed = -1;
      this.ySpeed = 0;
    }

    if (key === keyCode.ARROW_RIGHT && this.ySpeed !== 0 && this.canChange) {
      this.canChange = false;
      this.xSpeed = 1;
      this.ySpeed = 0;
    }

    if (key === keyCode.ARROW_UP && this.xSpeed !== 0 && this.canChange) {
      this.canChange = false;
      this.ySpeed = -1;
      this.xSpeed = 0;
    }

    if (key === keyCode.ARROW_DOWN && this.xSpeed !== 0 && this.canChange) {
      this.canChange = false;
      this.ySpeed = 1;
      this.xSpeed = 0;
    }
  }

  addPart(): void {
    const lastPart = this.parts[this.parts.length - 1];
    this.parts.push(new Part(lastPart.x, lastPart.y));
  }

  update(): void {
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    if (this.x < 0) {
      this.x = 0;
    }
    if (this.y < 0) {
      this.y = 0;
    }
    if (this.x > this.game.width - 1) {
      this.x = this.game.width - 1;
    }
    if (this.y > this.game.height - 1) {
      this.y = this.game.height - 1;
    }

    for (let i = this.parts.length - 1; i >= 0; i--) {
      const part = this.parts[i];

      if (part !== undefined) {
        if (i !== 0) {
          part.x = this.parts[i - 1].x;
          part.y = this.parts[i - 1].y;

          if (this.x === part.x && this.y === part.y) {
            this.die();
          }
        } else {
          part.x = this.x;
          part.y = this.y;
        }

        // Determine the head of a snake
        const isFirstPart = this.x === this.parts[0].x && this.y === this.parts[0].y;
        const isCurrentCellHead = this.x === part.x && this.y === part.y;
        const isFirstCellHead = isFirstPart && isCurrentCellHead;

        this.game.grid.fillGrid(part.x, part.y, false, isFirstCellHead);
      }
    }
    this.canChange = true;
  }

  die(): void {
    stopSnake();

    const lastScore = this.game.scoreValue;

    finishGame(this.game.store, { finished: true, score: lastScore });
  }
}

class Food {
  public x: number;
  public y: number;
  protected game: GameLogic;
  protected isFood: boolean;

  constructor(game: GameLogic) {
    this.game = game;
    this.isFood = true;

    this.x = this.generateRandomFoodPosition(this.game.width);
    this.y = Math.floor(Math.random() * this.game.height);
  }

  private generateRandomFoodPosition(maxValue: number): number {
    return Math.floor(Math.random() * maxValue);
  }

  placeFood(): void {
    this.x = this.generateRandomFoodPosition(this.game.width);
    this.y = this.generateRandomFoodPosition(this.game.height);
  }

  update(): void {
    this.game.grid.fillGrid(this.x, this.y, this.isFood, false);
  }
}

class Cell {
  public cell: CellInterface;
  public value: boolean;
  public isFood: boolean;
  public isHead: boolean;

  constructor(cell: CellInterface, value: boolean, isFood: boolean, isHead: boolean) {
    this.cell = cell;
    this.value = value;
    this.isFood = isFood;
    this.isHead = isHead;
  }
}

class RenderGrid {
  protected game: GameLogic;
  protected grid: Cell[][];

  constructor(game: GameLogic) {
    this.game = game;
    this.grid = [];

    this.buildGrid();
  }

  buildGrid(): void {
    for (let x = 0; x < this.game.width; x++) {
      this.grid[x] = [];

      for (let y = 0; y < this.game.height; y++) {
        const cell = document.createElement('div');
        // BackCell is for preventing buggy background when animating
        const backCell = document.createElement('div');

        backCell.classList.add('back-cell');
        backCell.style.width = backCell.style.height = this.game.size + 'px';
        backCell.style.left = x * this.game.size + 'px';
        backCell.style.top = y * this.game.size + 'px';

        cell.classList.add('cell');
        cell.style.width = cell.style.height = this.game.size + 'px';
        cell.style.left = x * this.game.size + 'px';
        cell.style.top = y * this.game.size + 'px';

        this.game.stage.appendChild(backCell);
        this.game.stage.appendChild(cell);

        this.grid[x][y] = new Cell(cell, false, false, false);
      }
    }
  }

  fillGrid(x: number, y: number, isFood: boolean, isHead: boolean): void {
    if (this.grid[x]) {
      if (this.grid[x][y]) {
        this.grid[x][y].value = true;
        this.grid[x][y].isFood = isFood;
        this.grid[x][y].isHead = isHead;
      }
    }
  }

  update(): void {
    for (let x = 0; x < this.game.width; x++) {
      for (let y = 0; y < this.game.height; y++) {
        const gridPiece = this.grid[x][y];

        // Empty or filled cell
        if (gridPiece.value) {
          gridPiece.cell.classList.add('filled');
          gridPiece.cell.classList.remove('empty');
        } else {
          gridPiece.cell.classList.add('empty');
          gridPiece.cell.classList.remove('filled');
        }
        // Is food or not
        if (gridPiece.isFood) {
          gridPiece.cell.classList.add('food');
        } else {
          gridPiece.cell.classList.remove('food');
        }
        // Is head or not
        if (gridPiece.isHead) {
          gridPiece.cell.classList.add('head');
        } else {
          gridPiece.cell.classList.remove('head');
        }
        gridPiece.value = false;
      }
    }
  }
}

class GameLogic {
  public store: object;
  public width: number;
  public height: number;
  public size: number;
  public stage: any;
  public scoreValue: number;
  public grid: RenderGrid;
  protected fps: number;
  protected food: Food;
  protected snake: Snake;

  constructor(store: object, width: number, height: number, size: number, fps: number) {
    this.store = store;
    this.width = width;
    this.height = height;
    this.size = size;
    this.fps = fps;

    this.stage = document.getElementById('stage');
    this.scoreValue = 0;

    this.grid = new RenderGrid(this);
    this.food = new Food(this);
    this.snake = new Snake(this);

    this.finishLoop();
    this.snake.update();
    this.grid.update();
  }

  startLoop(): void {
    setInterval(() => {
      this.update();
    }, 1000 / this.fps);
  }

  finishLoop(): void {
    stopSnake();
  }

  update(): void {
    this.food.update();
    this.snake.update();

    if (this.snake.x === this.food.x && this.snake.y === this.food.y) {
      this.food.placeFood();
      this.snake.addPart();
      this.scoreValue++;

      if (this.snake.parts.length === this.height * this.width) {
        this.snake.die();
        winGame(this.store);
      }
    }

    this.grid.update();
  }
}

function stopSnake(): void {
  // Clear all Timeouts to stop the snake
  // @ts-ignore
  let id = window.setTimeout(null, 0);
  while (id--) {
    window.clearTimeout(id);
  }
}

function finishGame(store, lastGame): void {
  store.dispatch('TOGGLE_GAME', lastGame);
}

function winGame(store): void {
  store.dispatch('WIN_GAME', true);
}

export default GameLogic;
