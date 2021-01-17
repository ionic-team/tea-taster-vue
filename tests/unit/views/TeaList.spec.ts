import { mount, VueWrapper } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import { Tea } from '@/models';

import store from '@/store';
import TeaList from '@/views/TeaList.vue';

describe('TeaList.vue', () => {
  let router: any;
  let wrapper: VueWrapper<any>;

  beforeEach(async () => {
    const teas: Array<Tea> = [
      {
        id: 1,
        name: 'Green',
        image: 'assets/img/green.jpg',
        description:
          'Green teas have the oxidation process stopped very early on, leaving them with a very subtle flavor and ' +
          'complex undertones. These teas should be steeped at lower temperatures for shorter periods of time.',
      },
      {
        id: 2,
        name: 'Black',
        image: 'assets/img/black.jpg',
        description:
          'A fully oxidized tea, black teas have a dark color and a full robust and pronounced flavor. Blad teas tend ' +
          'to have a higher caffeine content than other teas.',
      },
      {
        id: 3,
        name: 'Herbal',
        image: 'assets/img/herbal.jpg',
        description:
          'Herbal infusions are not actually "tea" but are more accurately characterized as infused beverages ' +
          'consisting of various dried herbs, spices, and fruits.',
      },
      {
        id: 4,
        name: 'Oolong',
        image: 'assets/img/oolong.jpg',
        description:
          'Oolong teas are partially oxidized, giving them a flavor that is not as robust as black teas but also ' +
          'not as suble as green teas. Oolong teas often have a flowery fragrance.',
      },
      {
        id: 5,
        name: 'Dark',
        image: 'assets/img/dark.jpg',
        description:
          'From the Hunan and Sichuan provinces of China, dark teas are flavorful aged probiotic teas that steeps ' +
          'up very smooth with slightly sweet notes.',
      },
      {
        id: 6,
        name: 'Puer',
        image: 'assets/img/puer.jpg',
        description:
          'An aged black tea from china. Puer teas have a strong rich flavor that could be described as "woody" or "peaty."',
      },
      {
        id: 7,
        name: 'White',
        image: 'assets/img/white.jpg',
        description:
          'White tea is produced using very young shoots with no oxidation process. White tea has an extremely ' +
          'delicate flavor that is sweet and fragrent. White tea should be steeped at lower temperatures for ' +
          'short periods of time.',
      },
    ];
    store.commit('teas/SET', teas);
    store.dispatch = jest.fn().mockResolvedValue(undefined);
    router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [{ path: '/', component: TeaList }],
    });
    router.push('/');
    await router.isReady();
    router.replace = jest.fn();
    wrapper = mount(TeaList, {
      global: { plugins: [router, store] },
    });
  });

  it('displays the title', () => {
    const titles = wrapper.findAllComponents('ion-title');
    expect(titles).toHaveLength(2);
    expect(titles[0].text()).toBe('Teas');
    expect(titles[1].text()).toBe('Teas');
  });

  describe('with seven teas', () => {
    it('displays two rows', () => {
      const rows = wrapper.findAllComponents('ion-grid ion-row');
      expect(rows).toHaveLength(2);
    });

    it('displays four columns in the first row', () => {
      const rows = wrapper.findAllComponents('ion-grid ion-row');
      const cols = rows[0].findAllComponents('ion-col');
      expect(cols).toHaveLength(4);
    });

    it('displays three columns in the second row', () => {
      const rows = wrapper.findAllComponents('ion-grid ion-row');
      const cols = rows[1].findAllComponents('ion-col');
      expect(cols).toHaveLength(3);
    });

    it('displays the name in the title', () => {
      const teas = wrapper.vm.teaData as Array<Tea>;
      const cols = wrapper.findAllComponents('ion-col');
      cols.forEach((c, idx) => {
        const title = c.findComponent(
          'ion-card ion-card-header ion-card-title',
        );
        expect(title.text()).toBe(teas[idx].name);
      });
    });

    it('displays the description in the content', () => {
      const teas = wrapper.vm.teaData as Array<Tea>;
      const cols = wrapper.findAllComponents('ion-col');
      cols.forEach((c, idx) => {
        const title = c.findComponent('ion-card ion-card-content');
        expect(title.text()).toBe(teas[idx].description);
      });
    });
  });

  it('dispatches a logout action when the logout button is clicked', () => {
    const button = wrapper.findComponent('[data-testid="logout-button"]');
    button.trigger('click');
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith('logout');
  });

  it('navigates to the login after the dispatch is complete', async () => {
    const button = wrapper.findComponent('[data-testid="logout-button"]');
    await button.trigger('click');
    expect(router.replace).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenCalledWith('/login');
  });
});
