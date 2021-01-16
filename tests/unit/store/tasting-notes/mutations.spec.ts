import { mutations } from '@/store/tasting-notes/mutations';
import { TastingNote } from '@/models';

const tastingNotes: Array<TastingNote> = [
  {
    id: 42,
    brand: 'Lipton',
    name: 'Green Tea',
    teaCategoryId: 3,
    rating: 3,
    notes: 'A basic green tea, very passable but nothing special',
  },
  {
    id: 314159,
    brand: 'Lipton',
    name: 'Yellow Label',
    teaCategoryId: 2,
    rating: 1,
    notes:
      'Very acidic, even as dark teas go, OK for iced tea, horrible for any other application',
  },
  {
    id: 73,
    brand: 'Rishi',
    name: 'Puer Cake',
    teaCategoryId: 6,
    rating: 5,
    notes: 'Smooth and peaty, the king of puer teas',
  },
  {
    id: 81,
    brand: 'Rishi',
    name: 'Sencha',
    teaCategoryId: 3,
    rating: 4,
    notes:
      'A basic green sencha with a grassy flavor. Very nice, but nothing special',
  },
];

describe('tasting notes mutations', () => {
  describe('CLEAR', () => {
    it('set the notes to an empty array', () => {
      const state = { list: tastingNotes };
      mutations.CLEAR(state);
      expect(state).toEqual({ list: [] });
    });
  });

  describe('SET', () => {
    it('sets the teas', () => {
      const state = { list: [] };
      mutations.SET(state, tastingNotes);
      expect(state).toEqual({ list: tastingNotes });
    });
  });

  describe('DELETE', () => {
    it('does fail if the node does not exist', () => {
      const state = { list: tastingNotes };
      const note = { ...tastingNotes[2] };
      note.id = 4273;
      mutations.DELETE(state, note);
      expect(state).toEqual({ list: tastingNotes });
    });

    it('removes the specified note', () => {
      const state = { list: [...tastingNotes] };
      const expectedState = { list: [...tastingNotes] };
      expectedState.list.splice(2, 1);
      const note = { ...tastingNotes[2] };
      mutations.DELETE(state, note);
      expect(state).toEqual(expectedState);
    });
  });

  describe('MERGE', () => {
    it('updates an existing note', () => {
      const state = { list: [...tastingNotes] };
      const note: TastingNote = {
        id: 314159,
        brand: 'Lipton',
        name: 'Yellow Label Orange Pekoe',
        teaCategoryId: 2,
        rating: 1,
        notes: 'Horrible for any application',
      };
      mutations.MERGE(state, note);
      expect(state.list.length).toBe(4);
      expect(state.list[1]).toEqual(note);
    });

    it('adds a new note to the end', () => {
      const state = { list: [...tastingNotes] };
      const note: TastingNote = {
        id: 4242,
        brand: 'Brewbie',
        name: 'Whispering Pine',
        teaCategoryId: 3,
        rating: 3,
        notes: 'Pretty good tea for having such a bad name',
      };
      mutations.MERGE(state, note);
      expect(state.list.length).toBe(5);
      expect(state.list[4]).toEqual(note);
    });
  });
});
