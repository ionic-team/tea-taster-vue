import { client } from './api';
import { Storage } from '@capacitor/storage';

import { Tea } from '@/models';

interface RawData {
  id: number;
  name: string;
  description: string;
}

const images: Array<string> = [
  'green',
  'black',
  'herbal',
  'oolong',
  'dark',
  'puer',
  'white',
  'yellow',
];

async function transformTea(data: RawData): Promise<Tea> {
  const { value } = await Storage.get({ key: `rating${data.id}` });
  return {
    ...data,
    image: `assets/img/${images[data.id - 1]}.jpg`,
    rating: parseInt(value || '0', 10),
  };
}

function unpackData(data: Array<RawData>): Promise<Array<Tea>> {
  return Promise.all(data.map(t => transformTea(t)));
}

export default {
  async getAll(): Promise<Array<Tea>> {
    return client
      .get('/tea-categories')
      .then(res => res.data && unpackData(res.data));
  },

  async save(tea: Tea): Promise<void> {
    return Storage.set({
      key: `rating${tea.id}`,
      value: tea.rating.toString(),
    });
  },
};
