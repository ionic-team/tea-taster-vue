import { createStore, createLogger } from 'vuex';

import { actions } from './actions';
import { mutations } from './mutations';
import { getters, state } from './state';

import TeasModule from './teas';

const debug = process.env.NODE_ENV === 'development';

export default createStore({
  state,
  actions,
  getters,
  mutations,
  modules: {
    teas: TeasModule,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});
