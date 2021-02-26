import { Storage } from '@capacitor/storage';
import { Session } from '@/models';

const key = 'session';

export default {
  async set(session: Session): Promise<void> {
    const value = JSON.stringify(session);
    await Storage.set({ key, value });
  },

  async get(): Promise<Session | undefined> {
    const { value } = await Storage.get({ key });
    if (value) {
      return JSON.parse(value);
    }
  },

  async clear(): Promise<void> {
    return Storage.remove({ key });
  },
};
