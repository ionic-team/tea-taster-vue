import { client } from '@/services/api';
import { Plugins } from '@capacitor/core';

import TeaService from '@/services/TeaService';

import { Tea } from '@/models';

jest.mock('@capacitor/core');

describe('TeaService', () => {
  let expectedTeas: Array<Tea>;
  let httpResultTeas: Array<{ id: number; name: string; description: string }>;

  function initializeTestData() {
    expectedTeas = [
      {
        id: 1,
        name: 'Green',
        image: 'assets/img/green.jpg',
        description: 'Green tea description.',
        rating: 3,
      },
      {
        id: 2,
        name: 'Black',
        image: 'assets/img/black.jpg',
        description: 'Black tea description.',
        rating: 0,
      },
      {
        id: 3,
        name: 'Herbal',
        image: 'assets/img/herbal.jpg',
        description: 'Herbal Infusion description.',
        rating: 2,
      },
      {
        id: 4,
        name: 'Oolong',
        image: 'assets/img/oolong.jpg',
        description: 'Oolong tea description.',
        rating: 0,
      },
      {
        id: 5,
        name: 'Dark',
        image: 'assets/img/dark.jpg',
        description: 'Dark tea description.',
        rating: 0,
      },
      {
        id: 6,
        name: 'Puer',
        image: 'assets/img/puer.jpg',
        description: 'Puer tea description.',
        rating: 5,
      },
      {
        id: 7,
        name: 'White',
        image: 'assets/img/white.jpg',
        description: 'White tea description.',
        rating: 4,
      },
      {
        id: 8,
        name: 'Yellow',
        image: 'assets/img/yellow.jpg',
        description: 'Yellow tea description.',
        rating: 0,
      },
    ];
    httpResultTeas = expectedTeas.map((t: Tea) => {
      const tea = { ...t };
      delete tea.image;
      delete tea.rating;
      return tea;
    });
  }

  beforeEach(() => {
    jest.clearAllMocks();
    initializeTestData();
  });

  describe('getAll', () => {
    beforeEach(() => {
      client.get = jest.fn().mockResolvedValue({});
      Plugins.Storage.get = jest.fn().mockImplementation(opt => {
        let value = null;
        switch (opt.key) {
          case 'rating1':
            value = '3';
            break;
          case 'rating3':
            value = '2';
            break;
          case 'rating6':
            value = '5';
            break;
          case 'rating7':
            value = '4';
            break;
        }

        return Promise.resolve({ value });
      });
    });

    it('gets the tea categories', async () => {
      await TeaService.getAll();
      expect(client.get).toHaveBeenCalledTimes(1);
      expect(client.get).toHaveBeenCalledWith('/tea-categories');
    });

    it('transforms the tea data', async () => {
      (client.get as any).mockResolvedValue({ data: httpResultTeas });
      const teas = await TeaService.getAll();
      expect(teas).toEqual(expectedTeas);
    });
  });

  describe('save', () => {
    it('saves the value', () => {
      const tea = { ...expectedTeas[4] };
      tea.rating = 4;
      TeaService.save(tea);
      expect(Plugins.Storage.set).toHaveBeenCalledTimes(1);
      expect(Plugins.Storage.set).toHaveBeenCalledWith({
        key: 'rating5',
        value: '4',
      });
    });
  });
});
