import { ActionContext } from 'vuex';

import TeaService from '@/services/TeaService';

import { State } from './state';
import { State as RootState } from '../state';
import { Tea } from '@/models';

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

  async rate(
    { commit }: ActionContext<State, RootState>,
    payload: { tea: Tea; rating: number },
  ): Promise<void> {
    TeaService.save({ ...payload.tea, rating: payload.rating });
    commit('SET_RATING', {
      id: payload.tea.id,
      rating: payload.rating,
    });
  },
};
