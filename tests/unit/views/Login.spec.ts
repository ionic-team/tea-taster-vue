import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { createRouter, createWebHistory } from '@ionic/vue-router';

import store from '@/store';
import Login from '@/views/Login.vue';

describe('Login.vue', () => {
  let router: any;
  let wrapper: VueWrapper<any>;
  beforeEach(async () => {
    store.dispatch = jest.fn().mockResolvedValue(true);
    router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [{ path: '/', component: Login }],
    });
    router.push('/');
    await router.isReady();
    wrapper = mount(Login, {
      global: {
        plugins: [router, store],
      },
    });
  });

  it('displays the title', () => {
    const titles = wrapper.findAllComponents('ion-title');
    expect(titles).toHaveLength(1);
    expect(titles[0].text()).toBe('Login');
  });

  it('displays messages as the user enters invalid data', async () => {
    const email = wrapper.findComponent('[data-testid="email-input"]');
    const password = wrapper.findComponent('[data-testid="password-input"]');
    const msg = wrapper.find('[data-testid="message-area"]');

    expect(msg.text()).toBe('');

    await email.setValue('foobar');
    expect(msg.text()).toBe('email: Value is not a valid email address');

    await email.setValue('');
    expect(msg.text()).toBe('email: Value is required');

    await email.setValue('foobar@baz.com');
    expect(msg.text()).toBe('');

    await password.setValue('mypassword');
    expect(msg.text()).toBe('');

    await password.setValue('');
    expect(msg.text()).toBe('password: Value is required');

    await password.setValue('mypassword');
    expect(msg.text()).toBe('');
  });

  it('has a disabled signin button until valid data is entered', async () => {
    const button = wrapper.findComponent('[data-testid="signin-button"]');
    const email = wrapper.findComponent('[data-testid="email-input"]');
    const password = wrapper.findComponent('[data-testid="password-input"]');

    expect(button.attributes().disabled).toBe('true');

    await email.setValue('foobar');
    expect(button.attributes().disabled).toBe('true');

    await password.setValue('mypassword');
    expect(button.attributes().disabled).toBe('true');

    await email.setValue('foobar@baz.com');
    expect(button.attributes().disabled).toBe('false');
  });

  describe('clicking the sign on button', () => {
    beforeEach(async () => {
      const email = wrapper.findComponent('[data-testid="email-input"]');
      const password = wrapper.findComponent('[data-testid="password-input"]');
      await email.setValue('test@test.com');
      await password.setValue('test');
    });

    it('dispatches the login action with the credentials', () => {
      const button = wrapper.findComponent('[data-testid="signin-button"]');
      button.trigger('click');
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith('login', {
        email: 'test@test.com',
        password: 'test',
      });
    });

    describe('if the login succeeds', () => {
      beforeEach(() => {
        (store.dispatch as any).mockResolvedValue(true);
      });

      it('does not show an error', async () => {
        const button = wrapper.findComponent('[data-testid="signin-button"]');
        const msg = wrapper.find('[data-testid="message-area"]');
        button.trigger('click');
        await flushPromises();
        expect(msg.text()).toBe('');
      });

      it('navigates to the root page', async () => {
        const button = wrapper.findComponent('[data-testid="signin-button"]');
        router.replace = jest.fn();
        button.trigger('click');
        await flushPromises();
        expect(router.replace).toHaveBeenCalledTimes(1);
        expect(router.replace).toHaveBeenCalledWith('/');
      });
    });

    describe('if the login succeeds', () => {
      beforeEach(() => {
        (store.dispatch as any).mockResolvedValue(false);
      });

      it('shows an error', async () => {
        const button = wrapper.findComponent('[data-testid="signin-button"]');
        const msg = wrapper.find('[data-testid="message-area"]');
        button.trigger('click');
        await flushPromises();
        expect(msg.text()).toContain(
          'Invalid Email or Password. Please try again.',
        );
      });

      it('does not navigate navigate', async () => {
        const button = wrapper.findComponent('[data-testid="signin-button"]');
        router.replace = jest.fn();
        button.trigger('click');
        await flushPromises();
        expect(router.replace).not.toHaveBeenCalled();
      });
    });
  });
});
