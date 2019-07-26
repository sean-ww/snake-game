import { findLowestHighScore } from '../Game.helpers';
import GameMutationTypes from './Game.mutation.types';

export default {
  [GameMutationTypes.FETCHING_SCORES](state, { isFetching, error = null }) {
    state.fetchingScores = isFetching;
    state.fetchingScoresError = error;
  },

  [GameMutationTypes.FETCHED_SCORES](state, scores) {
    state.scores = scores;
  },

  [GameMutationTypes.SAVING_SCORE](state, { isSaving, error = null }) {
    state.savingScore = isSaving;
    state.savingScoreError = error;
  },

  [GameMutationTypes.SAVE_SCORE](state) {
    state.enterScore = false;
  },

  [GameMutationTypes.TOGGLE_GAME](state, lastGame) {
    let enterScore = false;
    if (lastGame.finished && lastGame.score > findLowestHighScore(state.scores)) {
      enterScore = true;
    }
    state.enterScore = enterScore;
    state.lastGame.finished = lastGame.finished;
    state.lastGame.score = lastGame.score;
  },

  [GameMutationTypes.WIN_GAME](state, won) {
    state.gameWon = won;
  },
};
