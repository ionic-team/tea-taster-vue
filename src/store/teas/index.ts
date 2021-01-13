import { state, getters } from './state';
import { mutations } from './mutations';
import { actions } from './actions';

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
