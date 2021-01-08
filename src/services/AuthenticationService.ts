import { client } from './api';
import { User } from '@/models';

export default {
  async login(
    email: string,
    password: string,
  ): Promise<{
    success: boolean;
    user?: User;
    token?: string;
  }> {
    const response = await client.post('/login', { username: email, password });
    return {
      success: response.data.success,
      user: response.data.user,
      token: response.data.token,
    };
  },

  async logout(): Promise<void> {
    await client.post('/logout');
  },
};
