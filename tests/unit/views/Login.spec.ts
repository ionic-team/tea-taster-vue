import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { isPlatform } from '@ionic/vue';

import store from '@/store';
import Login from '@/views/Login.vue';
import { sessionVaultService } from '@/services/SessionVaultService';
import { AuthMode } from '@ionic-enterprise/identity-vault';

jest.mock('@ionic/vue', () => {
  const actual = jest.requireActual('@ionic/vue');
  return { ...actual, isPlatform: jest.fn().mockReturnValue(false) };
});

describe('Login.vue', () => {
  let router: any;
  let wrapper: VueWrapper<any>;

  function mountView(): VueWrapper<any> {
    return mount(Login, {
      global: {
        plugins: [router, store],
      },
    });
  }

  beforeEach(async () => {
    (isPlatform as any).mockReturnValue(true);
    store.dispatch = jest.fn().mockResolvedValue(true);
    router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [{ path: '/', component: Login }],
    });
    router.push('/');
    await router.isReady();
  });

  it('displays the title', () => {
    wrapper = mountView();
    const titles = wrapper.findAllComponents('ion-title');
    expect(titles).toHaveLength(1);
    expect(titles[0].text()).toBe('Login');
  });

  describe('with stored credentials that can be unlocked', () => {
    beforeEach(() => {
      sessionVaultService.canUnlock = jest.fn().mockResolvedValue(true);
      wrapper = mountView();
    });

    it('displays the unlock button', () => {
      const unlock = wrapper.find('[data-testid="unlock-button"]');
      expect(unlock.exists()).toBe(true);
    });

    it('does not display the email input', () => {
      const input = wrapper.findComponent('[data-testid="email-input"]');
      expect(input.exists()).toBe(false);
    });

    it('does not display the password input', () => {
      const input = wrapper.findComponent('[data-testid="password-input"]');
      expect(input.exists()).toBe(false);
    });

    it('does not display the auth mode select', () => {
      const select = wrapper.findComponent('[data-testid="auth-mode-select"]');
      expect(select.exists()).toBe(false);
    });

    it('labels the signin button as "Sign In Again"', () => {
      const button = wrapper.findComponent('[data-testid="signin-button"]');
      expect(button.text()).toBe('Sign In Again');
    });

    it('enables the signin button', () => {
      const button = wrapper.findComponent('[data-testid="signin-button"]');
      expect(button.attributes().disabled).toBe('false');
    });

    describe('clicking the unlock', () => {
      it('dispatches restore', async () => {
        const button = wrapper.find('[data-testid="unlock-button"]');
        await button.trigger('click');
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith('restore');
      });

      it('navigates to the main page if the session is restored', async () => {
        const button = wrapper.find('[data-testid="unlock-button"]');
        (store.dispatch as any).mockResolvedValue({ token: 425324 });
        router.replace = jest.fn();
        await button.trigger('click');
        await flushPromises();
        expect(router.replace).toHaveBeenCalledTimes(1);
        expect(router.replace).toHaveBeenCalledWith('/');
      });

      it('does not navigate if the session is not restored', async () => {
        const button = wrapper.find('[data-testid="unlock-button"]');
        (store.dispatch as any).mockResolvedValue(undefined);
        router.replace = jest.fn();
        await button.trigger('click');
        await flushPromises();
        expect(router.replace).not.toHaveBeenCalled();
      });
    });

    describe('clicking the signin button', () => {
      beforeEach(async () => {
        const button = wrapper.findComponent('[data-testid="signin-button"]');
        await button.trigger('click');
        await flushPromises();
      });

      it('hides the unlock button', () => {
        const unlock = wrapper.find('[data-testid="unlock-button"]');
        expect(unlock.exists()).toBe(false);
      });

      it('displays the email input', () => {
        const input = wrapper.find('[data-testid="email-input"]');
        expect(input.exists()).toBe(true);
      });

      it('displays the password input', () => {
        const input = wrapper.find('[data-testid="password-input"]');
        expect(input.exists()).toBe(true);
      });

      it('displays the auth mode select', () => {
        const select = wrapper.findComponent(
          '[data-testid="auth-mode-select"]',
        );
        expect(select.exists()).toBe(true);
      });

      it('labels the signin button as "Sign In"', () => {
        const button = wrapper.findComponent('[data-testid="signin-button"]');
        expect(button.text()).toBe('Sign In');
      });
    });
  });

  describe('without stored credentials that can be unlocked', () => {
    beforeEach(() => {
      sessionVaultService.canUnlock = jest.fn().mockResolvedValue(false);
      sessionVaultService.isBiometricsAvailable = jest
        .fn()
        .mockResolvedValue(false);
      wrapper = mountView();
    });

    it('does not display the unlock button', () => {
      const unlock = wrapper.find('[data-testid="unlock-button"]');
      expect(unlock.exists()).toBe(false);
    });

    it('displays the email input', () => {
      const input = wrapper.findComponent('[data-testid="email-input"]');
      expect(input.exists()).toBe(true);
    });

    it('displays the password input', () => {
      const input = wrapper.findComponent('[data-testid="password-input"]');
      expect(input.exists()).toBe(true);
    });

    it('displays the auth mode select', () => {
      const select = wrapper.findComponent('[data-testid="auth-mode-select"]');
      expect(select.exists()).toBe(true);
    });

    it('does not display the auth mode select on the web', () => {
      (isPlatform as any).mockReturnValue(false);
      wrapper = mountView();
      const select = wrapper.findComponent('[data-testid="auth-mode-select"]');
      expect(select.exists()).toBe(false);
    });

    describe('when biometrics is not available', () => {
      it('includes non-biometric auth modes', () => {
        const select = wrapper.findComponent(
          '[data-testid="auth-mode-select"]',
        );
        const opts = select.findAllComponents('ion-select-option');
        expect(opts.length).toBe(3);
        expect(opts[0].text()).toBe('Session PIN Unlock');
        expect(opts[1].text()).toBe('Never Lock Session');
        expect(opts[2].text()).toBe('Force Login');
      });

      it('defaults the auth mode to session pin unlock', () => {
        expect(wrapper.vm.authMode).toBe(AuthMode.PasscodeOnly);
      });
    });

    describe('when biometrics is available', () => {
      beforeEach(() => {
        (sessionVaultService.isBiometricsAvailable as any).mockResolvedValue(
          true,
        );
        wrapper = mountView();
      });

      it('includes biometric auth mode when available', () => {
        const select = wrapper.findComponent(
          '[data-testid="auth-mode-select"]',
        );
        const opts = select.findAllComponents('ion-select-option');
        expect(opts.length).toBe(4);
        expect(opts[0].text()).toBe('Biometric Unlock');
      });

      it('defaults the auth mode to biometric unlock', async () => {
        expect(wrapper.vm.authMode).toBe(AuthMode.BiometricOnly);
      });
    });

    it('labels the signin button as "Sign In"', () => {
      const button = wrapper.findComponent('[data-testid="signin-button"]');
      expect(button.text()).toBe('Sign In');
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
        const password = wrapper.findComponent(
          '[data-testid="password-input"]',
        );
        await email.setValue('test@test.com');
        await password.setValue('test');
      });

      it('dispatches the login action with the credentials', () => {
        const authMode = wrapper.findComponent(
          '[data-testid="auth-mode-select"]',
        );
        const button = wrapper.findComponent('[data-testid="signin-button"]');
        authMode.setValue(AuthMode.SecureStorage);
        button.trigger('click');
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith('login', {
          email: 'test@test.com',
          password: 'test',
          authMode: AuthMode.SecureStorage,
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
});
