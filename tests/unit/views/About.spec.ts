import { mount, VueWrapper } from '@vue/test-utils';
import { createRouter, createWebHistory } from '@ionic/vue-router';

import store from '@/store';
import About from '@/views/About.vue';

describe('About.vue', () => {
  let router: any;
  let wrapper: VueWrapper<any>;

  beforeEach(async () => {
    store.dispatch = jest.fn().mockResolvedValue(undefined);
    router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [{ path: '/', component: About }],
    });
    router.push('/');
    await router.isReady();
    router.replace = jest.fn();
    wrapper = mount(About, {
      global: {
        plugins: [router, store],
      },
    });
  });

  it('displays the title', () => {
    const titles = wrapper.findAllComponents('ion-title');
    expect(titles).toHaveLength(1);
    expect(titles[0].text()).toBe('About Tea Taster');
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
