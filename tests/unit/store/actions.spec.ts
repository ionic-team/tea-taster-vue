import { ActionContext } from 'vuex';
import { actions } from '@/store/actions';
import AuthenticationService from '@/services/AuthenticationService';
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
    it('commits CLEAR_SESSION', () => {
      actions.clear(context);
      expect(context.commit).toHaveBeenCalledTimes(1);
      expect(context.commit).toHaveBeenCalledWith('CLEAR_SESSION');
    });
  });

  describe('login', () => {
    beforeEach(() => {
      sessionVaultService.login = jest.fn();
      (AuthenticationService.login as any).mockResolvedValue({
        success: false,
      });
    });

    const payload = {
      email: 'test@test.com',
      password: 'thisisatest',
      authMode: AuthMode.BiometricAndPasscode,
    };

    it('calls the login', () => {
      actions.login(context, payload);
      expect(AuthenticationService.login).toHaveBeenCalledTimes(1);
      expect(AuthenticationService.login).toHaveBeenCalledWith(
        'test@test.com',
        'thisisatest',
      );
    });

    describe('on failure', () => {
      beforeEach(() => {
        (AuthenticationService.login as any).mockResolvedValue({
          success: false,
        });
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
        (AuthenticationService.login as any).mockResolvedValue({
          success: true,
          user: session.user,
          token: session.token,
        });
      });

      it('stores the session', async () => {
        await actions.login(context, payload);
        expect(sessionVaultService.login).toHaveBeenCalledTimes(1);
        expect(sessionVaultService.login).toHaveBeenCalledWith(
          session,
          payload.authMode,
        );
      });

      it('commits the session', async () => {
        await actions.login(context, payload);
        expect(context.commit).toHaveBeenCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith('SET_SESSION', session);
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
      expect(AuthenticationService.logout).toHaveBeenCalledTimes(1);
    });

    it('clears the session storage', async () => {
      await actions.logout(context);
      expect(sessionVaultService.logout).toHaveBeenCalledTimes(1);
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

      it('commits the session', async () => {
        await actions.restore(context);
        expect(context.commit).toHaveBeenCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith('SET_SESSION', session);
      });

      it('dispatches the load action', async () => {
        await actions.restore(context);
        expect(context.dispatch).toHaveBeenCalledTimes(1);
        expect(context.dispatch).toHaveBeenCalledWith('load');
      });
    });
  });
});
