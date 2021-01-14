import { mount, VueWrapper } from '@vue/test-utils';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import store from '@/store';
import TeaDetails from '@/views/TeaDetails.vue';
import { Tea } from '@/models';

describe('TeaDetails.vue', () => {
  let router: any;
  let wrapper: VueWrapper<any>;
  let tea: Tea;

  beforeEach(async () => {
    tea = {
      id: 4,
      name: 'Purple Tea',
      description: 'Is this actually a thing?',
      image: '/assets/img/nope.jpg',
      rating: 3,
    };
    store.commit('teas/SET', [tea]);
    store.dispatch = jest.fn();
    router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [{ path: '/teas/tea/:id', component: TeaDetails }],
    });
    router.push('/teas/tea/4');
    await router.isReady();
    wrapper = mount(TeaDetails, {
      global: {
        plugins: [router, store],
      },
    });
  });

  it('renders', () => {
    const header = wrapper.findComponent('ion-header');
    const content = wrapper.findComponent('ion-content');
    expect(header.exists()).toBe(true);
    expect(content.exists()).toBe(true);
  });

  it('renders the tea name', () => {
    const name = wrapper.find('[data-testid="name"]');
    expect(name.text()).toBe('Purple Tea');
  });

  it('renders the tea description', () => {
    const description = wrapper.find('[data-testid="description"]');
    expect(description.text()).toBe('Is this actually a thing?');
  });

  it('sets the rating based on the tea', () => {
    expect(wrapper.vm.rating).toBe(3);
  });

  it('dispatches rating on click', async () => {
    const rating = wrapper.find('[data-testid="rating"]');
    wrapper.setData({ rating: 2 });
    rating.trigger('click');
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith('teas/rate', {
      tea,
      rating: 2,
    });
  });
});
