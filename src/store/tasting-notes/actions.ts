import { ActionContext } from 'vuex';

import TastingNotesService from '@/services/TastingNotesService';

import { State } from './state';
import { State as RootState } from '../state';
import { TastingNote } from '@/models';

export const actions = {
  clear: {
    root: true,
    handler({ commit }: ActionContext<State, RootState>): void {
      commit('CLEAR');
    },
  },

  async load({ commit }: ActionContext<State, RootState>): Promise<void> {
    const teas = await TastingNotesService.getAll();
    commit('SET', teas);
  },

  async save(
    { commit }: ActionContext<State, RootState>,
    tastingNote: TastingNote,
  ): Promise<void> {
    const res = await TastingNotesService.save(tastingNote);
    if (res) {
      commit('MERGE', res);
    }
  },

  async delete(
    { commit }: ActionContext<State, RootState>,
    tastingNote: TastingNote,
  ): Promise<void> {
    if (tastingNote.id) {
      await TastingNotesService.delete(tastingNote);
      commit('DELETE', tastingNote);
    }
  },
};
