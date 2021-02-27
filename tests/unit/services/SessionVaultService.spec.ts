import { Storage } from '@capacitor/storage';
import SessionVaultService from '@/services/SessionVaultService';
import { Session } from '@/models';

jest.mock('@capacitor/storage');

describe('SessionVaultService', () => {
  beforeEach(() => {
    Storage.remove = jest.fn();
    Storage.set = jest.fn();
    Storage.get = jest.fn();
    jest.clearAllMocks();
  });

  describe('set', () => {
    it('sets the auth data using the user and token', async () => {
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
      (Storage.get as any).mockResolvedValue({ value: null });
      expect(await SessionVaultService.get()).toBeUndefined();
    });
  });

  describe('clear', () => {
    it('removes the data from storage', async () => {
      (Storage.remove as any).mockResolvedValue();
      await SessionVaultService.clear();
      expect(Storage.remove).toHaveBeenCalledTimes(1);
      expect(Storage.remove).toHaveBeenCalledWith({ key: 'session' });
    });
  });
});
