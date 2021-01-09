import { Session } from '@/models';

export interface State {
  session: Session | null;
}

export const state = {
  session: null,
};
