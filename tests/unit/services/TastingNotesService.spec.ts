import { client } from '@/services/api';
import TastingNoteseaService from '@/services/TastingNotesService';

describe('TastingNotesService', () => {
  beforeEach(() => {
    client.get = jest.fn().mockResolvedValue({});
    client.delete = jest.fn().mockResolvedValue({});
    client.post = jest.fn().mockResolvedValue({});
  });
  describe('getAll', () => {
    it('gets the user tasting notes', async () => {
      await TastingNoteseaService.getAll();
      expect(client.get).toHaveBeenCalledTimes(1);
      expect(client.get).toHaveBeenCalledWith('/user-tasting-notes');
    });
  });

  describe('get', () => {
    it('gets a user tasting note', async () => {
      await TastingNoteseaService.get(4);
      expect(client.get).toHaveBeenCalledTimes(1);
      expect(client.get).toHaveBeenCalledWith('/user-tasting-notes/4');
    });
  });

  describe('delete', () => {
    it('removes the specified note', async () => {
      await TastingNoteseaService.delete({
        id: 4,
        brand: 'Lipton',
        name: 'Yellow Label',
        notes: 'Overly acidic, highly tannic flavor',
        rating: 1,
        teaCategoryId: 3,
      });
      expect(client.delete).toHaveBeenCalledTimes(1);
      expect(client.delete).toHaveBeenCalledWith('/user-tasting-notes/4');
    });
  });

  describe('save', () => {
    it('saves a new note', async () => {
      await TastingNoteseaService.save({
        brand: 'Lipton',
        name: 'Yellow Label',
        notes: 'Overly acidic, highly tannic flavor',
        rating: 1,
        teaCategoryId: 3,
      });
      expect(client.post).toHaveBeenCalledTimes(1);
      expect(client.post).toHaveBeenCalledWith('/user-tasting-notes', {
        brand: 'Lipton',
        name: 'Yellow Label',
        notes: 'Overly acidic, highly tannic flavor',
        rating: 1,
        teaCategoryId: 3,
      });
    });

    it('saves an existing note', async () => {
      await TastingNoteseaService.save({
        id: 7,
        brand: 'Lipton',
        name: 'Yellow Label',
        notes: 'Overly acidic, highly tannic flavor',
        rating: 1,
        teaCategoryId: 3,
      });
      expect(client.post).toHaveBeenCalledTimes(1);
      expect(client.post).toHaveBeenCalledWith('/user-tasting-notes/7', {
        id: 7,
        brand: 'Lipton',
        name: 'Yellow Label',
        notes: 'Overly acidic, highly tannic flavor',
        rating: 1,
        teaCategoryId: 3,
      });
    });
  });
});
