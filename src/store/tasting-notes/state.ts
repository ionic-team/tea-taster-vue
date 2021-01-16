import { TastingNote } from '@/models';

export interface State {
  list: Array<TastingNote>;
}

export const state: State = {
  list: [],
};

export const getters = {
  find: (state: State) => (id: number): TastingNote | undefined =>
    state.list.find(t => t.id === id),
};
