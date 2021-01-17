import { ActionContext } from 'vuex';
import { AuthMode } from '@ionic-enterprise/identity-vault';

import { authenticationService } from '@/services/AuthenticationService';
import { sessionVaultService } from '@/services/SessionVaultService';

import { State } from './state';

export const actions = {
  async login(
    { commit, dispatch }: ActionContext<State, State>,
    payload: { authMode: AuthMode },
  ): Promise<boolean> {
    let success: boolean;
    try {
      await authenticationService.login();
      const user = await authenticationService.getUserInfo();
      sessionVaultService.setAuthMode(payload.authMode);
      commit('SET_USER', user);
      dispatch('load');
      success = true;
    } catch (err) {
      success = false;
    }

    return success;
  },

  async logout({ dispatch }: ActionContext<State, State>): Promise<void> {
    await authenticationService.logout();
    await sessionVaultService.logout();
    dispatch('clear');
  },

  async restore({
    commit,
    dispatch,
  }: ActionContext<State, State>): Promise<void> {
    try {
      await sessionVaultService.unlock();
      const user = await authenticationService.getUserInfo();
      commit('SET_USER', user);
      dispatch('load');
    } catch (err) {
      console.error(err);
    }
  },

  clear({ commit }: ActionContext<State, State>): void {
    commit('CLEAR_USER');
  },
};
