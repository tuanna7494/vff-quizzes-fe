import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { APIMapping } from 'common/api';
import { set, get } from 'lodash';
import { QUIZ_ACTION } from '../../constants';

export const fetchQuiz = createAsyncThunk<any, any, ThunkAPIConfig>(
  QUIZ_ACTION.FETCH,
  async (args, thunkAPI) => {
    const { quizService } = get(thunkAPI, 'extra') as APIMapping;

    const response = await quizService.fetchQuiz();
    return response.data;
  }
);

export const fetchQuizBuilder = (builder: ActionReducerMapBuilder<any>) => {
  builder.addCase(fetchQuiz.pending, (state: any, action: any) => {
    const { requestId } = action.meta;
    set(state, 'loading', 'pending');
    set(state, 'error', null);
    set(state, 'currentRequestId', requestId);
  });
  builder.addCase(fetchQuiz.fulfilled, (state: any, action: any) => {
    const { payload } = action;
    set(state, 'loading', 'idle');
    set(state, 'entities', payload.data);
    set(state, 'currentRequestId', undefined);
  });
  builder.addCase(fetchQuiz.rejected, (state: any, action) => {
    const { error } = action;
    set(state, 'loading', 'idle');
    set(state, 'error', error);
    set(state, 'currentRequestId', undefined);
  });
};
