import { ActionContext } from 'vuex';
import { actions } from '@/store/actions';
import AuthenticationService from '@/services/AuthenticationService';
import SessionVaultService from '@/services/SessionVaultService';
import { Session } from '@/models';

jest.mock('@/services/AuthenticationService');
jest.mock('@/services/SessionVaultService');

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
  beforeEach(() => jest.resetAllMocks());

  describe('clear', () => {
    it('commits CLEAR_SESSION', () => {
      actions.clear(context);
      expect(context.commit).toHaveBeenCalledTimes(1);
      expect(context.commit).toHaveBeenCalledWith('CLEAR_SESSION');
    });
  });

  describe('login', () => {
    beforeEach(() => {
      (AuthenticationService.login as any).mockResolvedValue({
        success: false,
      });
    });

    const credentials = {
      email: 'test@test.com',
      password: 'thisisatest',
    };

    it('calls the login', () => {
      actions.login(context, credentials);
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
        await actions.login(context, credentials);
        expect(SessionVaultService.set).not.toHaveBeenCalled();
      });

      it('does not commit any state changes', async () => {
        await actions.login(context, credentials);
        expect(context.commit).not.toHaveBeenCalled();
      });

      it('does not dispatch any further actions', async () => {
        await actions.login(context, credentials);
        expect(context.dispatch).not.toHaveBeenCalled();
      });

      it('resolves false', async () => {
        expect(await actions.login(context, credentials)).toBe(false);
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
        await actions.login(context, credentials);
        expect(SessionVaultService.set).toHaveBeenCalledTimes(1);
        expect(SessionVaultService.set).toHaveBeenCalledWith(session);
      });

      it('commits the session', async () => {
        await actions.login(context, credentials);
        expect(context.commit).toHaveBeenCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith('SET_SESSION', session);
      });

      it(`dispatches the load action`, async () => {
        await actions.login(context, credentials);
        expect(context.dispatch).toHaveBeenCalledTimes(1);
        expect(context.dispatch).toHaveBeenCalledWith('load');
      });

      it('resolves true', async () => {
        expect(await actions.login(context, credentials)).toBe(true);
      });
    });
  });

  describe('logout', () => {
    it('logs out', async () => {
      await actions.logout(context);
      expect(AuthenticationService.logout).toHaveBeenCalledTimes(1);
    });

    it('clears the session storage', async () => {
      await actions.logout(context);
      expect(SessionVaultService.clear).toHaveBeenCalledTimes(1);
    });

    it('dispatches the clear action', async () => {
      await actions.logout(context);
      expect(context.dispatch).toHaveBeenCalledTimes(1);
      expect(context.dispatch).toHaveBeenCalledWith('clear');
    });
  });

  describe('restore', () => {
    it('gets the current session from storage', async () => {
      await actions.restore(context);
      expect(SessionVaultService.get).toHaveBeenCalledTimes(1);
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
        (SessionVaultService.get as any).mockResolvedValue(session);
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
