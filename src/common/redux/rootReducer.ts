import { combineReducers } from '@reduxjs/toolkit';

// Reducers
import { reducer as app } from 'modules/App';
import { reducer as auth } from 'modules/Auth';
import { reducer as user } from 'modules/Users';
import { reducer as quiz } from 'modules/Quiz';

export const reducerMappingList = {
  app,
  auth,
  user,
  quiz
  // dashboard,
};

const rootReducer = combineReducers(reducerMappingList);
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
