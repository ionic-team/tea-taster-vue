import { client } from './api';
import { TastingNote } from '@/models';

const endpoint = '/user-tasting-notes';

export default {
  async getAll(): Promise<Array<TastingNote>> {
    const res = await client.get(endpoint);
    return (res && res.data) || [];
  },

  async get(id: number): Promise<TastingNote> {
    const res = await client.get(`${endpoint}/${id}`);
    return res.data;
  },

  async delete(tastingNote: TastingNote): Promise<void> {
    await client.delete(`${endpoint}/${tastingNote.id}`);
  },

  async save(tastingNote: TastingNote): Promise<TastingNote> {
    const url = endpoint + (tastingNote.id ? `/${tastingNote.id}` : '');
    const res = await client.post(url, tastingNote);
    return res.data;
  },
};
