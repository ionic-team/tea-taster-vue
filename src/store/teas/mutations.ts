import { State } from './state';
import { Tea } from '@/models';

export const mutations = {
  SET: (state: State, teas: Array<Tea>): Array<Tea> => (state.list = teas),
  CLEAR: (state: State): Array<Tea> => (state.list = []),
};
