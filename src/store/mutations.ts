import { State } from './state';
import { User } from '@/models';

export const mutations = {
  SET_USER: (state: State, user: User): User => (state.user = user),
  CLEAR_USER: (state: State): null => (state.user = null),
};
