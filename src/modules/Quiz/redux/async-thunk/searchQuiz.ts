import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { APIMapping } from 'common/api';
import { get, isEmpty, set } from 'lodash';

import { QUIZ_ACTION } from '../../constants';

export const searchQuiz = createAsyncThunk<any, any, ThunkAPIConfig>(
  QUIZ_ACTION.SEARCH,
  async (args, thunkAPI) => {
    if (isEmpty(args)) return;
    const { quizService } = get(thunkAPI, 'extra') as APIMapping;

    const response = await quizService.searchQuiz(args);
    return response.data;
  }
);

export const searchQuizBuilder = (builder: ActionReducerMapBuilder<any>) => {
  builder.addCase(searchQuiz.pending, (state: any, action: any) => {
    const { requestId } = action.meta;
    set(state, 'loading', 'pending');
    set(state, 'currentRequestId', null);
    set(state, 'currentRequestId', requestId);
  });
  builder.addCase(searchQuiz.fulfilled, (state: any, action: any) => {
    const { payload } = action;
    set(state, 'loading', 'idle');
    set(state, 'entities', payload.data);
    set(state, 'currentRequestId', undefined);
  });
  builder.addCase(searchQuiz.rejected, (state: any, action) => {
    const { error } = action;
    set(state, 'loading', 'idle');
    set(state, 'error', error);
    set(state, 'currentRequestId', undefined);
  });
};
