import { State } from './state';
import { Session } from '@/models';

export const mutations = {
  SET_SESSION: (state: State, session: Session) => (state.session = session),
  CLEAR_SESSION: (state: State) => (state.session = null),
};
