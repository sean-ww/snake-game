import gameActions from '~~/Game/store/Game.actions';
import gameGetters from '~~/Game/store/Game.getters';
import gameMutations from '~~/Game/store/Game.mutations';
import gameState from '~~/Game/store/Game.state';

export const actions = gameActions;

export const getters = gameGetters;

export const mutations = gameMutations;

export const state = () => gameState;
