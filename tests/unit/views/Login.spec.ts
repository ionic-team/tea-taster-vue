import { mount, VueWrapper } from '@vue/test-utils';
import { VuelidatePlugin } from '@vuelidate/core';
import Login from '@/views/Login.vue';

describe('Login.vue', () => {
  let wrapper: VueWrapper<any>;
  beforeEach(async () => {
    wrapper = mount(Login, {
      global: {
        plugins: [VuelidatePlugin],
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
});
