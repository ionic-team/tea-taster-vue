import { State } from './state';
import { Session } from '@/models';

export const mutations = {
  SET_SESSION: (state: State, session: Session): Session =>
    (state.session = session),
  CLEAR_SESSION: (state: State): null => (state.session = null),
};
