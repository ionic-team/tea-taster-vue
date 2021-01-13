import { mutations } from '@/store/teas/mutations';
import { Tea } from '@/models';

const teas: Array<Tea> = [
  {
    id: 1,
    name: 'Green',
    image: 'assets/img/green.jpg',
    description: 'Green tea description',
  },
  {
    id: 2,
    name: 'Black',
    image: 'assets/img/black.jpg',
    description: 'A fully oxidized tea',
  },
  {
    id: 3,
    name: 'Herbal',
    image: 'assets/img/herbal.jpg',
    description: 'Herbal infusions are not actually "tea"',
  },
];

describe('tea mutations', () => {
  describe('CLEAR', () => {
    it('set the teas to an empty array', () => {
      const state = { list: teas };
      mutations.CLEAR(state);
      expect(state).toEqual({ list: [] });
    });
  });

  describe('SET', () => {
    it('sets the teas', () => {
      const state = { list: [] };
      mutations.SET(state, teas);
      expect(state).toEqual({ list: teas });
    });
  });
});
