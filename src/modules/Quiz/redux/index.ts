import { createSlice } from '@reduxjs/toolkit';
import {
  addQuiz,
  addQuizBuilder,
  deleteQuiz,
  deleteQuizBuilder,
  fetchQuiz,
  fetchQuizBuilder,
  getQuizByUserId,
  getQuizByUserIdBuilder,
  searchQuiz,
  updateQuiz,
  searchQuizBuilder,
  updateQuizBuilder,
  saveResult,
  saveResultBuilder
} from './async-thunk';
import reducers, { defaultState } from './reducers';

const { actions, reducer } = createSlice({
  name: 'quiz',
  initialState: { ...defaultState },
  reducers,
  extraReducers: builder => {
    fetchQuizBuilder(builder);
    getQuizByUserIdBuilder(builder);
    addQuizBuilder(builder);
    deleteQuizBuilder(builder);
    searchQuizBuilder(builder);
    updateQuizBuilder(builder);
    saveResultBuilder(builder);
  }
});

const extraActions = {
  ...actions,
  fetchQuiz,
  getQuizByUserId,
  addQuiz,
  deleteQuiz,
  searchQuiz,
  updateQuiz,
  saveResult
};

export * from './select-hooks';
export { extraActions as actionsQuiz, reducer };
