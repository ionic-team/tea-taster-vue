import { client } from './api';
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

function unpackData(data: Array<RawData>): Array<Tea> {
  return data.map(t => ({ ...t, image: `assets/img/${images[t.id - 1]}.jpg` }));
}

export default {
  async getAll(): Promise<Array<Tea>> {
    return client
      .get('/tea-categories')
      .then(res => res.data && unpackData(res.data));
  },
};
