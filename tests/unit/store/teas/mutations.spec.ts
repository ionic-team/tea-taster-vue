import { mutations } from '@/store/teas/mutations';
import { Tea } from '@/models';

const teas: Array<Tea> = [
  {
    id: 1,
    name: 'Green',
    image: 'assets/img/green.jpg',
    description: 'Green tea description',
    rating: 3,
  },
  {
    id: 2,
    name: 'Black',
    image: 'assets/img/black.jpg',
    description: 'A fully oxidized tea',
    rating: 1,
  },
  {
    id: 3,
    name: 'Herbal',
    image: 'assets/img/herbal.jpg',
    description: 'Herbal infusions are not actually "tea"',
    rating: 0,
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

  describe('SET_RATING', () => {
    it('sets the specific tea', () => {
      const state = { list: teas };
      mutations.SET_RATING(state, { id: teas[1].id, rating: 4 });
      const expectedTeas = [...teas];
      expectedTeas[1] = { ...teas[1], rating: 4 };
      expect(state).toEqual({ list: expectedTeas });
    });
  });
});
