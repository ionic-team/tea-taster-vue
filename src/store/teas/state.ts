import { Tea } from '@/models';

export interface State {
  list: Array<Tea>;
}

export const state: State = {
  list: [],
};

export const getters = {
  find: (state: State) => (id: number): Tea | undefined =>
    state.list.find(t => t.id === id),
};
