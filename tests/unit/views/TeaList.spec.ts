import { mount, VueWrapper } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import { Tea } from '@/models';

import store from '@/store';
import TeaList from '@/views/TeaList.vue';

describe('TeaList.vue', () => {
  let router: any;
  let wrapper: VueWrapper<any>;

  beforeEach(async () => {
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
