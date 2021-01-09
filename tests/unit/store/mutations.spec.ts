import { mutations } from '@/store/mutations';
import { Session } from '@/models';

const session: Session = {
  user: {
    id: 314159,
    firstName: 'Pumpkin',
    lastName: 'Pi',
    email: 'ppi@math.org',
  },
  token: 'thisisnotatoken',
};

describe('root mutations', () => {
  describe('SET_SESSION', () => {
    it('sets the session', () => {
      const state = { session: null };
      mutations.SET_SESSION(state, session);
      expect(state).toEqual({ session });
    });
  });

  describe('CLEAR_SESSION', () => {
    it('clears the session', () => {
      const state = { session };
      mutations.CLEAR_SESSION(state);
      expect(state).toEqual({ session: null });
    });
  });
});
