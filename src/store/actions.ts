import { ActionContext } from 'vuex';

import AuthenticationService from '@/services/AuthenticationService';
import SessionVaultService from '@/services/SessionVaultService';

import { State } from './state';
import { Session } from '@/models';

export const actions = {
  async login(
    { commit, dispatch }: ActionContext<State, State>,
    credentials: { email: string; password: string },
  ): Promise<boolean> {
    const response = await AuthenticationService.login(
      credentials.email,
      credentials.password,
    );
    if (response.success && response.user && response.token) {
      const session: Session = {
        user: response.user,
        token: response.token,
      };
      commit('SET_SESSION', session);
      dispatch('load');
      SessionVaultService.set(session);
    }
    return response?.success;
  },

  async logout({ dispatch }: ActionContext<State, State>): Promise<void> {
    await AuthenticationService.logout();
    await SessionVaultService.clear();
    dispatch('clear');
  },

  async restore({
    commit,
    dispatch,
  }: ActionContext<State, State>): Promise<void> {
    const session = await SessionVaultService.get();
    if (session) {
      commit('SET_SESSION', session);
      dispatch('load');
    }
  },

  clear({ commit }: ActionContext<State, State>): void {
    commit('CLEAR_SESSION');
  },
};
