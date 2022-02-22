import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { APIMapping } from 'common/api';
import { get, isEmpty, set } from 'lodash';
import { QUIZ_ACTION } from '../../constants';

export const getQuizByUserId = createAsyncThunk<any, any, ThunkAPIConfig>(
  QUIZ_ACTION.GET_BY_ID,
  async (args, thunkAPI) => {
    if (isEmpty(args)) return;
    const { quizService } = get(thunkAPI, 'extra') as APIMapping;

    const response = await quizService.getQuizByUserId({
      headers: { Token: `${args}` }
    });
    return response.data;
  }
);

export const getQuizByUserIdBuilder = (
  builder: ActionReducerMapBuilder<any>
) => {
  builder.addCase(getQuizByUserId.pending, (state: any, action: any) => {
    const { requestId } = action.meta;
    set(state, 'loading', 'pending');
    set(state, 'currentRequestId', null);
    set(state, 'currentRequestId', requestId);
  });
  builder.addCase(getQuizByUserId.fulfilled, (state: any, action: any) => {
    const { payload } = action;
    set(state, 'loading', 'idle');
    set(state, 'entities', payload?.data);
    set(state, 'currentRequestId', undefined);
  });
  builder.addCase(getQuizByUserId.rejected, (state: any, action) => {
    const { error } = action;
    set(state, 'loading', 'idle');
    set(state, 'error', error);
    set(state, 'currentRequestId', undefined);
  });
};
