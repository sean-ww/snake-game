import GameMutationTypes from './Game.mutation.types';

export default {
  async GET_SCORES({ commit }) {
    commit(GameMutationTypes.FETCHING_SCORES, { isFetching: true });
    await this.$axios
      .get('/score')
      .then(response => {
        commit(GameMutationTypes.FETCHED_SCORES, response.data);
        commit(GameMutationTypes.FETCHING_SCORES, { isFetching: false });
      })
      .catch(error => {
        commit(GameMutationTypes.FETCHED_SCORES, []);
        commit(GameMutationTypes.FETCHING_SCORES, { isFetching: false, error });
      });
  },

  async SAVE_SCORE({ commit }, { name, score }) {
    commit(GameMutationTypes.SAVING_SCORE, { isSaving: true });
    await this.$axios
      .post('/score', {
        name,
        score,
      })
      .then(() => {
        commit(GameMutationTypes.SAVE_SCORE);
        commit(GameMutationTypes.SAVING_SCORE, { isSaving: false });
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          // the score is not a high score, so proceed
          commit(GameMutationTypes.SAVE_SCORE);
          commit(GameMutationTypes.SAVING_SCORE, { isSaving: false });
          return;
        }
        commit(GameMutationTypes.SAVING_SCORE, { isSaving: false, error });
      });
  },

  TOGGLE_GAME({ commit }, lastGame) {
    commit(GameMutationTypes.TOGGLE_GAME, lastGame);
  },

  WIN_GAME({ commit }, won) {
    commit(GameMutationTypes.WIN_GAME, won);
  },
};
