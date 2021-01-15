import { mount, VueWrapper } from '@vue/test-utils';

import store from '@/store';
import About from '@/views/About.vue';

describe('About.vue', () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    store.dispatch = jest.fn();
    wrapper = mount(About, {
      global: {
        plugins: [store],
      },
    });
  });

  it('displays the title', () => {
    const titles = wrapper.findAllComponents('ion-title');
    expect(titles).toHaveLength(1);
    expect(titles[0].text()).toBe('About');
  });
});
