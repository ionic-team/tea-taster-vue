import { Plugins } from '@capacitor/core';
import { Session } from '@/models';

const key = 'session';

export default {
  async set(session: Session): Promise<void> {
    const { Storage } = Plugins;
    const value = JSON.stringify(session);
    await Storage.set({ key, value });
  },

  async get(): Promise<Session | undefined> {
    const { Storage } = Plugins;
    const { value } = await Storage.get({ key });
    if (value) {
      return JSON.parse(value);
    }
  },

  async clear(): Promise<void> {
    const { Storage } = Plugins;
    return Storage.remove({ key });
  },
};
