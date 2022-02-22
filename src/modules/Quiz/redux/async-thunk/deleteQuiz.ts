import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { APIMapping } from 'common/api';
import { get, isEmpty, set } from 'lodash';
import { QUIZ_ACTION } from 'modules/Quiz/constants';

export const deleteQuiz = createAsyncThunk<any, any, ThunkAPIConfig>(
  QUIZ_ACTION.DELETE,
  async (args, thunkAPI) => {
    if (isEmpty(args)) return;
    const { quizService } = get(thunkAPI, 'extra') as APIMapping;

    const response = await quizService.deleteQuiz(args.data, {
      headers: { Token: `${args.token}` }
    });
    return response.data;
  }
);

export const deleteQuizBuilder = (builder: ActionReducerMapBuilder<any>) => {
  builder.addCase(deleteQuiz.pending, (state: any, action: any) => {
    const { requestId } = action.meta;
    set(state, 'loading', 'pending');
    set(state, 'currentRequestId', null);
    set(state, 'currentRequestId', requestId);
  });
  builder.addCase(deleteQuiz.fulfilled, (state: any, action: any) => {
    set(state, 'loading', 'idle');
    set(state, 'currentRequestId', undefined);
  });
  builder.addCase(deleteQuiz.rejected, (state: any, action) => {
    const { error } = action;
    set(state, 'loading', 'idle');
    set(state, 'error', error);
    set(state, 'currentRequestId', undefined);
  });
};
