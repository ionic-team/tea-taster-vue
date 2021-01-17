import { mutations } from '@/store/mutations';
import { User } from '@/models';

const user: User = {
  id: 314159,
  firstName: 'Pumpkin',
  lastName: 'Pi',
  email: 'ppi@math.org',
};

describe('root mutations', () => {
  describe('SET_USER', () => {
    it('sets the session', () => {
      const state = { user: null };
      mutations.SET_USER(state, user);
      expect(state).toEqual({ user });
    });
  });

  describe('CLEAR_SESSION', () => {
    it('clears the session', () => {
      const state = { user };
      mutations.CLEAR_USER(state);
      expect(state).toEqual({ user: null });
    });
  });
});
