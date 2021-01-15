import { mount, VueWrapper } from '@vue/test-utils';

import store from '@/store';
import TastingNotess from '@/views/TastingNotes.vue';

describe('TastingNotess.vue', () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    store.dispatch = jest.fn();
    wrapper = mount(TastingNotess, {
      global: {
        plugins: [store],
      },
    });
  });

  it('displays the title', () => {
    const titles = wrapper.findAllComponents('ion-title');
    expect(titles).toHaveLength(1);
    expect(titles[0].text()).toBe('Tasting Notes');
  });
});
