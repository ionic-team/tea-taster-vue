import { Plugins } from '@capacitor/core';
import SessionVaultService from '@/services/SessionVaultService';
import { Session } from '@/models';

jest.mock('@capacitor/core');

describe('SessionVaultService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('set', () => {
    it('sets the auth data using the user and token', async () => {
      const { Storage } = Plugins;
      (Storage.set as any).mockResolvedValue();
      const session: Session = {
        user: {
          id: 73,
          firstName: 'Sheldon',
          lastName: 'Cooper',
          email: 'physics@caltech.edu',
        },
        token: '98761243',
      };
      await SessionVaultService.set(session);
      expect(Storage.set).toHaveBeenCalledTimes(1);
      expect(Storage.set).toHaveBeenCalledWith({
        key: 'session',
        value: JSON.stringify(session),
      });
    });
  });

  describe('get', () => {
    beforeEach(() => {
      const { Storage } = Plugins;
      (Storage.get as any).mockResolvedValue({
        value: JSON.stringify({
          user: {
            id: 42,
            firstName: 'Douglas',
            lastName: 'Adams',
            email: 'thanksfor@thefish.com',
          },
          token: '12349876',
        } as Session),
      });
    });

    it('gets the value from storage', async () => {
      const { Storage } = Plugins;
      await SessionVaultService.get();
      expect(Storage.get).toHaveBeenCalledTimes(1);
      expect(Storage.get).toHaveBeenCalledWith({ key: 'session' });
    });

    it('returns the value', async () => {
      const session = await SessionVaultService.get();
      expect(session).toEqual({
        user: {
          id: 42,
          firstName: 'Douglas',
          lastName: 'Adams',
          email: 'thanksfor@thefish.com',
        },
        token: '12349876',
      });
    });

    it('returns undefined if a value has not been set', async () => {
      const { Storage } = Plugins;
      (Storage.get as any).mockResolvedValue({ value: null });
      expect(await SessionVaultService.get()).toBeUndefined();
    });
  });

  describe('clear', () => {
    it('removes the data from storage', async () => {
      const { Storage } = Plugins;
      (Storage.remove as any).mockResolvedValue();
      await SessionVaultService.clear();
      expect(Storage.remove).toHaveBeenCalledTimes(1);
      expect(Storage.remove).toHaveBeenCalledWith({ key: 'session' });
    });
  });
});
