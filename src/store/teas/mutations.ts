import { State } from './state';
import { Tea } from '@/models';

export const mutations = {
  SET: (state: State, teas: Array<Tea>): Array<Tea> => (state.list = teas),
  CLEAR: (state: State): Array<Tea> => (state.list = []),
  SET_RATING: (state: State, payload: { id: number; rating: number }): void => {
    const targetTea = state.list.find(t => t.id === payload.id);
    if (targetTea) {
      targetTea.rating = payload.rating;
    }
  },
};
