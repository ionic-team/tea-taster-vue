import { ActionContext } from 'vuex';
import { actions } from '@/store/tasting-notes/actions';

import TastingNotesService from '@/services/TastingNotesService';
import { TastingNote } from '@/models';

jest.mock('@/services/TastingNotesService');

const context: ActionContext<any, any> = {
  commit: jest.fn(),
  dispatch: jest.fn(),
  getters: {},
  state: {},
  rootGetters: {},
  rootState: {},
};

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

describe('tasting notes actions', () => {
  beforeEach(() => jest.resetAllMocks());

  describe('clear', () => {
    it('commits CLEAR', () => {
      actions.clear.handler(context);
      expect(context.commit).toHaveBeenCalledTimes(1);
      expect(context.commit).toHaveBeenCalledWith('CLEAR');
    });
  });

  describe('load', () => {
    beforeEach(() => {
      (TastingNotesService.getAll as any).mockResolvedValue(tastingNotes);
    });

    fit('gets the tasting notes', async () => {
      await actions.load(context);
      expect(TastingNotesService.getAll).toHaveBeenCalledTimes(1);
    });

    it('commits the tasting notes', async () => {
      await actions.load(context);
      expect(context.commit).toHaveBeenCalledTimes(1);
      expect(context.commit).toHaveBeenCalledWith('SET', tastingNotes);
    });
  });

  describe('save', () => {
    let note: TastingNote;
    beforeEach(() => {
      note = {
        brand: 'Rishi',
        name: 'Matcha',
        teaCategoryId: 3,
        rating: 5,
        notes: 'Very rich with lots of fresh flavor',
      };
      (TastingNotesService.save as any).mockResolvedValue({
        id: 4242,
        ...note,
      });
    });

    it('saves the tasting note', async () => {
      await actions.save(context, note);
      expect(TastingNotesService.save).toHaveBeenCalledTimes(1);
      expect(TastingNotesService.save).toHaveBeenCalledWith(note);
    });

    it('performs a MERGE commit with the saved note', async () => {
      await actions.save(context, note);
      expect(context.commit).toHaveBeenCalledTimes(1);
      expect(context.commit).toHaveBeenCalledWith('MERGE', {
        id: 4242,
        ...note,
      });
    });
  });

  describe('delete', () => {
    let note: TastingNote;
    beforeEach(() => {
      note = { ...tastingNotes[1] };
    });

    it('deletes the tasting note', async () => {
      await actions.delete(context, note);
      expect(TastingNotesService.delete).toHaveBeenCalledTimes(1);
      expect(TastingNotesService.delete).toHaveBeenCalledWith(note);
    });

    it('performs a DELETE commit on the deleted note', async () => {
      await actions.delete(context, note);
      expect(context.commit).toHaveBeenCalledTimes(1);
      expect(context.commit).toHaveBeenCalledWith('DELETE', note);
    });
  });
});
