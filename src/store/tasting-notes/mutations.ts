import { State } from './state';
import { TastingNote } from '@/models';

export const mutations = {
  SET: (state: State, teas: Array<TastingNote>): Array<TastingNote> =>
    (state.list = teas),
  CLEAR: (state: State): Array<TastingNote> => (state.list = []),
  DELETE: (state: State, tastingNote: TastingNote): void => {
    const idx = state.list.findIndex(x => x.id === tastingNote.id);
    if (idx > -1) {
      state.list.splice(idx, 1);
    }
  },
  MERGE: (state: State, tastingNote: TastingNote): void => {
    const idx = state.list.findIndex(x => x.id === tastingNote.id);
    if (idx > -1) {
      state.list.splice(idx, 1, tastingNote);
    } else {
      state.list.push(tastingNote);
    }
  },
};
