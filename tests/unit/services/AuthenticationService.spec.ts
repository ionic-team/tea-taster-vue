import { client } from '@/services/api';
import AuthenticationService from '@/services/AuthenticationService';
import { User } from '@/models';

describe('AuthenticationService', () => {
  describe('login', () => {
    beforeEach(() => {
      client.post = jest.fn().mockResolvedValue({
        data: { success: false },
      });
    });

    it('posts to the login endpoint', () => {
      AuthenticationService.login('test@test.com', 'testpassword');
      expect(client.post).toHaveBeenCalledTimes(1);
      expect(client.post).toHaveBeenCalledWith('/login', {
        username: 'test@test.com',
        password: 'testpassword',
      });
    });

    it('unpacks an unsuccessful login', async () => {
      expect(
        await AuthenticationService.login('test@test.com', 'password'),
      ).toEqual({ success: false });
    });

    it('unpacks a successful login', async () => {
      const user: User = {
        id: 314159,
        firstName: 'Testy',
        lastName: 'McTest',
        email: 'test@test.com',
      };
      (client.post as any).mockResolvedValue({
        data: {
          success: true,
          user,
          token: '123456789',
        },
      });
      expect(
        await AuthenticationService.login('test@test.com', 'password'),
      ).toEqual({ success: true, user, token: '123456789' });
    });
  });

  describe('logout', () => {
    it('posts to the logout endpoint', () => {
      client.post = jest.fn().mockResolvedValue({ data: null });
      AuthenticationService.logout();
      expect(client.post).toHaveBeenCalledTimes(1);
      expect(client.post).toHaveBeenCalledWith('/logout');
    });
  });
});
