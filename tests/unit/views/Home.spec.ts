import { mount } from '@vue/test-utils';
import Home from '@/views/Home.vue';

describe('Home.vue', () => {
  it('displays the title', () => {
    const wrapper = mount(Home);
    const titles = wrapper.findAllComponents('ion-title');
    expect(titles).toHaveLength(2);
    expect(titles[0].text()).toBe('Blank');
    expect(titles[1].text()).toBe('Blank');
  });

  it('displays the default text', () => {
    const wrapper = mount(Home);
    const container = wrapper.find('#container');
    expect(container.text()).toContain('Ready to create an app?');
  });
});
