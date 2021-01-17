import { ActionContext } from 'vuex';
import { actions } from '@/store/actions';
import { authenticationService } from '@/services/AuthenticationService';
import { sessionVaultService } from '@/services/SessionVaultService';
import { Session } from '@/models';
import { AuthMode } from '@ionic-enterprise/identity-vault';

jest.mock('@/services/AuthenticationService');

const context: ActionContext<any, any> = {
  commit: jest.fn(),
  dispatch: jest.fn(),
  getters: {},
  state: {},
  rootGetters: {},
  rootState: {},
};

const session: Session = {
  token: '12341234',
  user: {
    id: 42,
    firstName: 'Douglas',
    lastName: 'Adams',
    email: 'fish@yummy.com',
  },
};

describe('root actions', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('clear', () => {
    it('commits CLEAR_USER', () => {
      actions.clear(context);
      expect(context.commit).toHaveBeenCalledTimes(1);
      expect(context.commit).toHaveBeenCalledWith('CLEAR_USER');
    });
  });

  describe('login', () => {
    beforeEach(() => {
      sessionVaultService.login = jest.fn();
      (authenticationService.login as any).mockResolvedValue();
    });

    const payload = {
      authMode: AuthMode.BiometricAndPasscode,
    };

    it('calls the login', () => {
      actions.login(context, payload);
      expect(authenticationService.login).toHaveBeenCalledTimes(1);
    });

    describe('on failure', () => {
      beforeEach(() => {
        (authenticationService.login as any).mockRejectedValue();
      });

      it('does not store the session', async () => {
        await actions.login(context, payload);
        expect(sessionVaultService.login).not.toHaveBeenCalled();
      });

      it('does not commit any state changes', async () => {
        await actions.login(context, payload);
        expect(context.commit).not.toHaveBeenCalled();
      });

      it('does not dispatch any further actions', async () => {
        await actions.login(context, payload);
        expect(context.dispatch).not.toHaveBeenCalled();
      });

      it('resolves false', async () => {
        expect(await actions.login(context, payload)).toBe(false);
      });
    });

    describe('on success', () => {
      beforeEach(() => {
        (authenticationService.login as any).mockResolvedValue();
      });

      it('commits the user', async () => {
        await actions.login(context, payload);
        expect(context.commit).toHaveBeenCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith('SET_USER', session);
      });

      it(`dispatches the load action`, async () => {
        await actions.login(context, payload);
        expect(context.dispatch).toHaveBeenCalledTimes(1);
        expect(context.dispatch).toHaveBeenCalledWith('load');
      });

      it('resolves true', async () => {
        expect(await actions.login(context, payload)).toBe(true);
      });
    });
  });

  describe('logout', () => {
    beforeEach(() => (sessionVaultService.logout = jest.fn()));

    it('logs out', async () => {
      await actions.logout(context);
      expect(authenticationService.logout).toHaveBeenCalledTimes(1);
    });

    it('dispatches the clear action', async () => {
      await actions.logout(context);
      expect(context.dispatch).toHaveBeenCalledTimes(1);
      expect(context.dispatch).toHaveBeenCalledWith('clear');
    });
  });

  describe('restore', () => {
    beforeEach(() => (sessionVaultService.restoreSession = jest.fn()));

    it('gets the current session from storage', async () => {
      await actions.restore(context);
      expect(sessionVaultService.restoreSession).toHaveBeenCalledTimes(1);
    });

    describe('without a stored session', () => {
      it('does not commit the session', async () => {
        await actions.restore(context);
        expect(context.commit).not.toHaveBeenCalled();
      });

      it('does not dispatch any further actions', async () => {
        await actions.restore(context);
        expect(context.dispatch).not.toHaveBeenCalled();
      });
    });

    describe('with a stored session', () => {
      beforeEach(() => {
        (sessionVaultService.restoreSession as any).mockResolvedValue(session);
      });

      it('commits the user', async () => {
        await actions.restore(context);
        expect(context.commit).toHaveBeenCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith('SET_USER', session);
      });

      it('dispatches the load action', async () => {
        await actions.restore(context);
        expect(context.dispatch).toHaveBeenCalledTimes(1);
        expect(context.dispatch).toHaveBeenCalledWith('load');
      });
    });
  });
});
