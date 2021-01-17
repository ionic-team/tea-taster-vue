import { User } from '@/models';

export interface State {
  user: User | null;
}

export const state = {
  user: null,
};

export const getters = {};
