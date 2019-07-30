import { Component, Vue } from 'vue-property-decorator';
import GameLogic from './Game.logic';
import { LastGameInterface } from './Game.interfaces';
import keyCode from './keyCode.constants';
import Popup from './Popup';

@Component({
  name: 'Game',

  components: {
    Popup,
  },
})
export default class Game extends Vue {
  game: any = null;
  difficulty: number = 10;
  isPlaying: boolean = false;
  gameStarted: boolean = false;
  gamePaused: boolean = false;

  private mounted(): void {
    window.addEventListener('keydown', event => {
      this.buttonPressed(event.keyCode);
    });

    this.getHighScores();
    this.createGame();
  }

  get lastGame(): LastGameInterface {
    return {
      finished: this.$store.getters.finishedGame.finished,
      lastScore: this.$store.getters.finishedGame.score,
    };
  }

  getHighScores(): void {
    this.$store.dispatch('GET_SCORES');
  }

  createGame(): void {
    this.removePreviousCells();

    this.game = new GameLogic(this.$store, 24, 24, 24, this.difficulty);
    this.gameStarted = false;
    this.isPlaying = false;
    this.gamePaused = false;

    this.$store.dispatch('TOGGLE_GAME', { finished: false, score: 0 });
    this.$store.dispatch('WIN_GAME', false);
  }

  startGame(): void {
    this.game.startLoop();

    this.gameStarted = true;
    this.isPlaying = true;
    this.gamePaused = false;

    this.$store.dispatch('TOGGLE_GAME', { finished: false, score: 0 });
    this.$store.dispatch('WIN_GAME', false);
  }

  pauseGame(): void {
    this.game.finishLoop();
    this.isPlaying = false;
    this.gamePaused = true;
  }

  resumeGame(): void {
    this.game.startLoop();
    this.isPlaying = true;
    this.gamePaused = false;
  }

  togglePause() {
    if (this.gamePaused) {
      this.resumeGame();
      return;
    }
    this.pauseGame();
  }

  buttonPressed(key): void {
    if (this.lastGame.finished) return;

    const arrowKeyClicked = keyCode.ARROW_KEYS.find(value => value === key);

    if (!this.gameStarted && arrowKeyClicked) {
      this.startGame();
    }

    if (this.gameStarted && this.gamePaused && arrowKeyClicked) {
      this.resumeGame();
    }

    if (key === keyCode.SPACE_KEY) {
      this.togglePause();
    }

    if (this.gameStarted && arrowKeyClicked) {
      this.game.snake.controller(key);
    }
  }

  removePreviousCells(): void {
    if (this.game !== null) {
      const stage = this.game.stage;

      while (stage.hasChildNodes()) {
        stage.removeChild(stage.lastChild);
      }
    }
  }
}
