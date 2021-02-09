import { mount, VueWrapper } from '@vue/test-utils';
import { Plugins } from '@capacitor/core';
import { isPlatform, modalController } from '@ionic/vue';

import AppTastingNoteEditor from '@/components/AppTastingNoteEditor.vue';
import store from '@/store';
import { Tea } from '@/models';

jest.mock('@capacitor/core');
jest.mock('@ionic/vue', () => {
  const actual = jest.requireActual('@ionic/vue');
  return { ...actual, isPlatform: jest.fn() };
});

function mountComponent(noteId?: number) {
  return mount(AppTastingNoteEditor, {
    props: {
      noteId,
    },
    global: {
      plugins: [store],
    },
  });
}

describe('AppTastingNoteEditor.vue', () => {
  let wrapper: VueWrapper<any>;
  let teas: Array<Tea>;

  beforeEach(async () => {
    (isPlatform as any).mockImplementation((key: string) => key === 'hybrid');
    teas = [
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
        rating: 0,
      },
    ];
    store.commit('teas/SET', teas);
    store.commit('tastingNotes/SET', [
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
    ]);
    store.dispatch = jest.fn();
    modalController.dismiss = jest.fn();
    wrapper = mountComponent();
  });

  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('binds the teas in the select', () => {
    const select = wrapper.findComponent('[data-testid="tea-type-select"]');
    const opts = select.findAllComponents('ion-select-option');
    expect(opts.length).toBe(3);
    expect(opts[0].text()).toBe('Green');
    expect(opts[1].text()).toBe('Black');
    expect(opts[2].text()).toBe('Herbal');
  });

  it('displays messages as the user enters invalid data', async () => {
    const brand = wrapper.findComponent('[data-testid="brand-input"]');
    const name = wrapper.findComponent('[data-testid="name-input"]');
    const notes = wrapper.findComponent('[data-testid="notes-textbox"]');
    const msg = wrapper.find('[data-testid="message-area"]');

    expect(msg.text()).toBe('');

    await brand.setValue('foobar');
    expect(msg.text()).toBe('');

    await brand.setValue('');
    expect(msg.text()).toBe('brand: Value is required');

    await brand.setValue('Lipton');
    expect(msg.text()).toBe('');

    await name.setValue('foobar');
    expect(msg.text()).toBe('');

    await name.setValue('');
    expect(msg.text()).toBe('name: Value is required');

    await name.setValue('Yellow Label');
    expect(msg.text()).toBe('');

    await notes.setValue('foobar');
    expect(msg.text()).toBe('');

    await notes.setValue('');
    expect(msg.text()).toBe('notes: Value is required');

    await notes.setValue('Not very good');
    expect(msg.text()).toBe('');
  });

  it('displays an appropriate title', async () => {
    const title = wrapper.findComponent('ion-title');
    expect(title.text()).toBe('Add New Tasting Note');
    await wrapper.setProps({ noteId: 42 });
    expect(title.text()).toBe('Tasting Note');
  });

  it('displays an appropriate button label', async () => {
    const btn = wrapper.findComponent('[data-testid="submit-button"]');
    expect(btn.text()).toBe('Add');
    await wrapper.setProps({ noteId: 42 });
    expect(btn.text()).toBe('Update');
  });

  it('populates the data when editing a note', () => {
    const modal = mountComponent(73);
    expect(modal.vm.brand).toEqual('Rishi');
    expect(modal.vm.name).toEqual('Puer Cake');
    expect(modal.vm.teaCategoryId).toEqual(6);
    expect(modal.vm.rating).toEqual(5);
    expect(modal.vm.notes).toEqual('Smooth and peaty, the king of puer teas');
  });

  describe('submit button', () => {
    it('is disabled until valid data is entered', async () => {
      const brand = wrapper.findComponent('[data-testid="brand-input"]');
      const name = wrapper.findComponent('[data-testid="name-input"]');
      const teaType = wrapper.findComponent('[data-testid="tea-type-select"]');
      const rating = wrapper.findComponent('[data-testid="rating-input"]');
      const notes = wrapper.findComponent('[data-testid="notes-textbox"]');

      const button = wrapper.findComponent('[data-testid="submit-button"]');

      expect(button.attributes().disabled).toBe('true');

      await brand.setValue('foobar');
      expect(button.attributes().disabled).toBe('true');

      await name.setValue('mytea');
      expect(button.attributes().disabled).toBe('true');

      await teaType.setValue(3);
      expect(button.attributes().disabled).toBe('true');

      await rating.setValue(2);
      expect(button.attributes().disabled).toBe('true');

      await notes.setValue('Meh. It is ok.');
      expect(button.attributes().disabled).toBe('false');
    });

    describe('on click', () => {
      beforeEach(async () => {
        const brand = wrapper.findComponent('[data-testid="brand-input"]');
        const name = wrapper.findComponent('[data-testid="name-input"]');
        const teaType = wrapper.findComponent(
          '[data-testid="tea-type-select"]',
        );
        const rating = wrapper.findComponent('[data-testid="rating-input"]');
        const notes = wrapper.findComponent('[data-testid="notes-textbox"]');

        await brand.setValue('foobar');
        await name.setValue('mytea');
        await teaType.setValue(3);
        await rating.setValue(2);
        await notes.setValue('Meh. It is ok.');
      });

      it('dispatches the save action', async () => {
        const button = wrapper.findComponent('[data-testid="submit-button"]');
        await button.trigger('click');

        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith('tastingNotes/save', {
          brand: 'foobar',
          name: 'mytea',
          rating: 2,
          teaCategoryId: 3,
          notes: 'Meh. It is ok.',
        });
      });

      it('includes the ID if it set', async () => {
        const button = wrapper.findComponent('[data-testid="submit-button"]');
        await wrapper.setProps({ noteId: 4273 });
        await button.trigger('click');

        expect(store.dispatch).toHaveBeenCalledWith('tastingNotes/save', {
          id: 4273,
          brand: 'foobar',
          name: 'mytea',
          rating: 2,
          teaCategoryId: 3,
          notes: 'Meh. It is ok.',
        });
      });

      it('closes the modal', async () => {
        const button = wrapper.findComponent('[data-testid="submit-button"]');

        expect(modalController.dismiss).not.toHaveBeenCalled();
        await button.trigger('click');
        expect(modalController.dismiss).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('cancel button', () => {
    it('does not dispatch', async () => {
      const button = wrapper.findComponent('[data-testid="cancel-button"]');
      await button.trigger('click');
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('closes the modal', async () => {
      const button = wrapper.findComponent('[data-testid="cancel-button"]');

      expect(modalController.dismiss).not.toHaveBeenCalled();
      await button.trigger('click');
      expect(modalController.dismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('share button', () => {
    describe('in a web context', () => {
      beforeEach(() => {
        (isPlatform as any).mockImplementation(
          (key: string) => key !== 'hybrid',
        );
      });

      it('does not exist', () => {
        const modal = mountComponent();
        const button = modal.findComponent('[data-testid="share-button"]');
        expect(button.exists()).toBe(false);
      });
    });

    it('exists', () => {
      const button = wrapper.findComponent('[data-testid="share-button"]');
      expect(button.exists()).toBe(true);
    });

    it('is disabled until enough information is entered', async () => {
      const button = wrapper.findComponent('[data-testid="share-button"]');
      const brand = wrapper.findComponent('[data-testid="brand-input"]');
      const name = wrapper.findComponent('[data-testid="name-input"]');
      const rating = wrapper.findComponent('[data-testid="rating-input"]');

      expect(button.attributes().disabled).toBe('true');

      await brand.setValue('foobar');
      expect(button.attributes().disabled).toBe('true');

      await name.setValue('mytea');
      expect(button.attributes().disabled).toBe('true');

      await rating.setValue(2);
      expect(button.attributes().disabled).toBe('false');
    });

    it('calls the share plugin when pressed', async () => {
      const { Share } = Plugins;
      const button = wrapper.findComponent('[data-testid="share-button"]');
      const brand = wrapper.findComponent('[data-testid="brand-input"]');
      const name = wrapper.findComponent('[data-testid="name-input"]');
      const rating = wrapper.findComponent('[data-testid="rating-input"]');

      await brand.setValue('foobar');
      await name.setValue('mytea');
      await rating.setValue(2);

      await button.trigger('click');

      expect(Share.share).toHaveBeenCalledTimes(1);
      expect(Share.share).toHaveBeenCalledWith({
        title: 'foobar: mytea',
        text: 'I gave foobar: mytea 2 stars on the Tea Taster app',
        dialogTitle: 'Share your tasting note',
        url: 'https://tea-taster-training.web.app',
      });
    });
  });
});
