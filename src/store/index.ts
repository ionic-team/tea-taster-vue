import { createStore, createLogger } from 'vuex';

import { actions } from './actions';
import { mutations } from './mutations';
import { getters, state } from './state';

import TastingNotesModule from './tasting-notes';
import TeasModule from './teas';

const debug = process.env.NODE_ENV === 'development';

export default createStore({
  state,
  actions,
  getters,
  mutations,
  modules: {
    tastingNotes: TastingNotesModule,
    teas: TeasModule,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});
