import { Session } from '@/models';

export interface State {
  session: Session | null;
}

export const state = {
  session: null,
};

export const getters = {
  sessionToken: (state: State): string | undefined => state.session?.token,
};
