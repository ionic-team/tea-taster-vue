import { ActionContext } from 'vuex';

import TeaService from '@/services/TeaService';

import { State } from './state';
import { State as RootState } from '../state';

export const actions = {
  clear: {
    root: true,
    handler({ commit }: ActionContext<State, RootState>): void {
      commit('CLEAR');
    },
  },

  load: {
    root: true,
    async handler({ commit }: ActionContext<State, RootState>): Promise<void> {
      const teas = await TeaService.getAll();
      commit('SET', teas);
    },
  },
};
