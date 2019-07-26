import { mutationArrayToNamespacedObject } from '~~/helpers';

const mutationTypes = ['FETCHING_SCORES', 'FETCHED_SCORES', 'SAVING_SCORE', 'SAVE_SCORE', 'TOGGLE_GAME', 'WIN_GAME'];

export default mutationArrayToNamespacedObject(mutationTypes, 'game');
