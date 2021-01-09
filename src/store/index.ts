import { createStore, createLogger } from 'vuex';

import { actions } from './actions';
import { mutations } from './mutations';
import { state } from './state';

const debug = process.env.NODE_ENV === 'development';

export default createStore({
  state,
  actions,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});
