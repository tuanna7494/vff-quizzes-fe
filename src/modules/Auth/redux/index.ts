import { createSlice } from '@reduxjs/toolkit';
import {
  getCurrentUser,
  getCurrentUserBuilder,
  login,
  loginBuilder
} from './async-thunk';
import reducers, { defaultState } from './reducers';

const { actions, reducer } = createSlice({
  name: 'auth',
  initialState: { ...defaultState },
  reducers,
  extraReducers: builder => {
    loginBuilder(builder);
    getCurrentUserBuilder(builder);
  }
});

const extraActions = {
  ...actions,
  login,
  getCurrentUser
};

export * from './select-hooks';
export { extraActions as actionsAuth, reducer };
