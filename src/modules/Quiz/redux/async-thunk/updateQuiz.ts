import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { APIMapping } from 'common/api';
import { set, get, isEmpty } from 'lodash';
import { QUIZ_ACTION } from '../../constants';

export const updateQuiz = createAsyncThunk<any, any, ThunkAPIConfig>(
  QUIZ_ACTION.UPDATE,
  async (args, thunkAPI) => {
    if (isEmpty(args)) return;
    const { quizService } = get(thunkAPI, 'extra') as APIMapping;

    const { data, id } = args;
    const response = await quizService.updateQuiz(id, data, {
      headers: { Token: `${args.token}` }
    });
    return response.data;
  }
);

export const updateQuizBuilder = (builder: ActionReducerMapBuilder<any>) => {
  builder.addCase(updateQuiz.pending, (state: any, action: any) => {
    const { requestId } = action.meta;
    set(state, 'loading', 'pending');
    set(state, 'error', null);
    set(state, 'currentRequestId', requestId);
  });
  builder.addCase(updateQuiz.fulfilled, (state: any, action: any) => {
    set(state, 'loading', 'idle');
    set(state, 'currentRequestId', undefined);
  });
  builder.addCase(updateQuiz.rejected, (state: any, action) => {
    const { error } = action;
    set(state, 'loading', 'idle');
    set(state, 'error', error);
    set(state, 'currentRequestId', undefined);
  });
};
