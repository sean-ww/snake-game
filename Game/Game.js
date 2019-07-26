// Based upon https://github.com/ilyagru/Space-Snake

import keyCode from './keyCode.constants';

class Part {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Snake {
  constructor(game) {
    this.game = game;
    this.x = 12;
    this.y = 12;
    this.xspeed = 0;
    this.yspeed = 1;
    this.canChange = true;
    this.parts = [
      { x: 12, y: 12 },
      { x: 12, y: 11 },
      { x: 12, y: 10 },
      { x: 11, y: 10 },
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
  }

  controller(key) {
    if (key === keyCode.ARROW_LEFT && this.yspeed !== 0 && this.canChange) {
      this.canChange = false;
      this.xspeed = -1;
      this.yspeed = 0;
    }

    if (key === keyCode.ARROW_RIGHT && this.yspeed !== 0 && this.canChange) {
      this.canChange = false;
      this.xspeed = 1;
      this.yspeed = 0;
    }

    if (key === keyCode.ARROW_UP && this.xspeed !== 0 && this.canChange) {
      this.canChange = false;
      this.yspeed = -1;
      this.xspeed = 0;
    }

    if (key === keyCode.ARROW_DOWN && this.xspeed !== 0 && this.canChange) {
      this.canChange = false;
      this.yspeed = 1;
      this.xspeed = 0;
    }
  }

  addPart() {
    const lastPart = this.parts[this.parts.length - 1];
    this.parts.push(new Part(lastPart.x, lastPart.y));
  }

  update() {
    this.x += this.xspeed;
    this.y += this.yspeed;

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

  die() {
    stopSnake();

    const lastScore = this.game.scoreValue;

    finishGame(this.game.store, { finished: true, score: lastScore });
  }
}

class Food {
  constructor(game) {
    this.game = game;
    this.isFood = true;

    this.placeFood();
  }

  placeFood() {
    this.x = Math.floor(Math.random() * this.game.width);
    this.y = Math.floor(Math.random() * this.game.height);
  }

  update() {
    this.game.grid.fillGrid(this.x, this.y, this.isFood, false);
  }
}

class RenderGrid {
  constructor(game) {
    this.game = game;
    this.grid = [];

    this.buildGrid();
  }

  buildGrid() {
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

        this.grid[x][y] = {
          cell,
          value: false,
          isFood: false,
          isHead: false,
        };
      }
    }
  }

  fillGrid(x, y, isFood, isHead) {
    if (this.grid[x]) {
      if (this.grid[x][y]) {
        this.grid[x][y].value = true;
        this.grid[x][y].isFood = isFood;
        this.grid[x][y].isHead = isHead;
      }
    }
  }

  update() {
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

class Game {
  constructor(store, width, height, size, fps) {
    this.store = store;
    this.width = width;
    this.height = height;
    this.size = size;
    this.fps = fps;

    this.stage = document.getElementById('stage');
    this.score = document.getElementById('score');
    this.scoreValue = 0;

    this.grid = new RenderGrid(this);
    this.food = new Food(this);
    this.snake = new Snake(this);

    this.finishLoop();
    this.snake.update();
    this.grid.update();
  }

  startLoop() {
    this.intVal = setInterval(() => {
      this.update();
    }, 1000 / this.fps);
    // Property isPlaying = true
    return true;
  }

  finishLoop() {
    stopSnake();
    // Property isPlaying = false
    return false;
  }

  update() {
    this.food.update();
    this.snake.update();

    if (this.snake.x === this.food.x && this.snake.y === this.food.y) {
      this.food.placeFood();
      this.snake.addPart();
      this.scoreValue++;

      if (this.snake.parts.length === this.height * this.width) {
        this.snake.die();
        winGame(this.store, true);
      }
    }

    this.grid.update();
  }
}

function stopSnake() {
  // Clear all Timeouts to stop the snake
  let id = window.setTimeout(null, 0);
  while (id--) {
    window.clearTimeout(id);
  }
}

function finishGame(store, lastGame) {
  store.dispatch('TOGGLE_GAME', lastGame);
}

function winGame(store) {
  store.dispatch('WIN_GAME', true);
}

export default Game;
