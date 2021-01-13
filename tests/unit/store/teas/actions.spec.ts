import { ActionContext } from 'vuex';
import { actions } from '@/store/teas/actions';

import TeaService from '@/services/TeaService';
import { Tea } from '@/models';

jest.mock('@/services/TeaService');

const context: ActionContext<any, any> = {
  commit: jest.fn(),
  dispatch: jest.fn(),
  getters: {},
  state: {},
  rootGetters: {},
  rootState: {},
};

const teas: Array<Tea> = [
  {
    id: 1,
    name: 'Green',
    image: 'assets/img/green.jpg',
    description: 'Green teas have the oxidation process stopped.',
  },
  {
    id: 2,
    name: 'Black',
    image: 'assets/img/black.jpg',
    description: 'A fully oxidized tea.',
  },
  {
    id: 3,
    name: 'Herbal',
    image: 'assets/img/herbal.jpg',
    description: 'Herbal infusions are not actually tea.',
  },
];

describe('tea actions', () => {
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
      (TeaService.getAll as any).mockResolvedValue(teas);
    });

    it('gets the teas', async () => {
      await actions.load.handler(context);
      expect(TeaService.getAll).toHaveBeenCalledTimes(1);
    });

    it('commits the teas', async () => {
      await actions.load.handler(context);
      expect(context.commit).toHaveBeenCalledTimes(1);
      expect(context.commit).toHaveBeenCalledWith('SET', teas);
    });
  });
});
