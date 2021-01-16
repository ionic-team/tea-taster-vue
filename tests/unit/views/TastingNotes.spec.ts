import { mount, VueWrapper } from '@vue/test-utils';
import { createRouter, createWebHistory } from '@ionic/vue-router';

import App from '@/App.vue';
import store from '@/store';
import TastingNotes from '@/views/TastingNotes.vue';
import { TastingNote } from '@/models';

describe('TastingNotes.vue', () => {
  let tastingNotes: Array<TastingNote>;
  let wrapper: VueWrapper<any>;

  beforeEach(async () => {
    tastingNotes = [
      {
        id: 42,
        brand: 'Lipton',
        name: 'Green Tea',
        teaCategoryId: 3,
        rating: 3,
        notes: 'A basic green tea, very passable but nothing special',
      },
      {
        id: 314159,
        brand: 'Lipton',
        name: 'Yellow Label',
        teaCategoryId: 2,
        rating: 1,
        notes:
          'Very acidic, even as dark teas go, OK for iced tea, horrible for any other application',
      },
      {
        id: 73,
        brand: 'Rishi',
        name: 'Puer Cake',
        teaCategoryId: 6,
        rating: 5,
        notes: 'Smooth and peaty, the king of puer teas',
      },
    ];
    store.dispatch = jest.fn().mockImplementation((action: string) => {
      if (action === 'tastingNotes/load') {
        store.commit('tastingNotes/SET', tastingNotes);
      }
    });
    store.commit('SET_SESSION', {
      token: '1234',
      user: {
        id: 14,
        firstName: 'Tony',
        lastName: 'Test',
        email: 'tony@test.com',
      },
    });
    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [{ path: '/', component: TastingNotes }],
    });
    router.push('/');
    await router.isReady();
    wrapper = mount(App, {
      global: {
        plugins: [router, store],
      },
    });
  });

  it('displays the title', () => {
    const titles = wrapper.findAllComponents('ion-title');
    expect(titles).toHaveLength(2);
    expect(titles[0].text()).toBe('Tasting Notes');
    expect(titles[1].text()).toBe('Tasting Notes');
  });

  it('displays the notes', () => {
    const list = wrapper.findComponent('[data-testid="notes-list"]');
    const items = list.findAllComponents('ion-item');
    expect(items.length).toBe(3);
    expect(items[0].text()).toContain('Lipton');
    expect(items[0].text()).toContain('Green Tea');
    expect(items[1].text()).toContain('Lipton');
    expect(items[1].text()).toContain('Yellow Label');
    expect(items[2].text()).toContain('Rishi');
    expect(items[2].text()).toContain('Puer Cake');
  });

  // TODO: This test is skipped for now. We need a testing mock for the modal controller within the framework
  describe.skip('adding a new note', () => {
    it('displays the modal', async () => {
      const button = wrapper.findComponent('[data-testid="add-note-button"]');
      await button.trigger('click');
      const modal = wrapper.findComponent('ion-modal');
      expect(modal).toBeTruthy();
    });
  });
});
