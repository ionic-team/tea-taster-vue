import { ActionContext } from 'vuex';
import { AuthMode } from '@ionic-enterprise/identity-vault';

import AuthenticationService from '@/services/AuthenticationService';
import { sessionVaultService } from '@/services/SessionVaultService';

import { State } from './state';
import { Session } from '@/models';

async function restoreSession(): Promise<Session | undefined> {
  try {
    return await sessionVaultService.restoreSession();
  } catch (err) {
    return undefined;
  }
}

export const actions = {
  async login(
    { commit, dispatch }: ActionContext<State, State>,
    payload: { email: string; password: string; authMode: AuthMode },
  ): Promise<boolean> {
    const response = await AuthenticationService.login(
      payload.email,
      payload.password,
    );
    if (response.success && response.user && response.token) {
      const session: Session = {
        user: response.user,
        token: response.token,
      };
      commit('SET_SESSION', session);
      dispatch('load');
      sessionVaultService.login(session, payload.authMode);
    }
    return response?.success;
  },

  async logout({ dispatch }: ActionContext<State, State>): Promise<void> {
    await AuthenticationService.logout();
    await sessionVaultService.logout();
    dispatch('clear');
  },

  async restore({
    commit,
    dispatch,
  }: ActionContext<State, State>): Promise<Session | undefined> {
    const session = await restoreSession();
    if (session) {
      commit('SET_SESSION', session);
      dispatch('load');
    }
    return session;
  },

  clear({ commit }: ActionContext<State, State>): void {
    commit('CLEAR_SESSION');
  },
};
