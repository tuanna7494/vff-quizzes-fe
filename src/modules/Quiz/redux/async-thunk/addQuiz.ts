import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { APIMapping } from 'common/api';
import { set, get, isEmpty } from 'lodash';
import { QUIZ_ACTION } from '../../constants';

export const addQuiz = createAsyncThunk<any, any, ThunkAPIConfig>(
  QUIZ_ACTION.ADD,
  async (args, thunkAPI) => {
    if (isEmpty(args)) return;
    const { quizService } = get(thunkAPI, 'extra') as APIMapping;

    const { data } = args;
    const response = await quizService.addQuiz(
      { headers: { Token: `${args.token}` } },
      data
    );
    return response.data;
  }
);

export const addQuizBuilder = (builder: ActionReducerMapBuilder<any>) => {
  builder.addCase(addQuiz.pending, (state: any, action: any) => {
    const { requestId } = action.meta;
    set(state, 'loading', 'pending');
    set(state, 'error', null);
    set(state, 'currentRequestId', requestId);
  });
  builder.addCase(addQuiz.fulfilled, (state: any, action: any) => {
    set(state, 'loading', 'idle');
    set(state, 'currentRequestId', undefined);
  });
  builder.addCase(addQuiz.rejected, (state: any, action) => {
    const { error } = action;
    set(state, 'loading', 'idle');
    set(state, 'error', error);
    set(state, 'currentRequestId', undefined);
  });
};
