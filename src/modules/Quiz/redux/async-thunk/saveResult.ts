import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { APIMapping } from 'common/api';
import { set, get, isEmpty } from 'lodash';
import { QUIZ_ACTION } from '../../constants';

export const saveResult = createAsyncThunk<any, any, ThunkAPIConfig>(
  QUIZ_ACTION.SAVE_RESULT,
  async (args, thunkAPI) => {
    if (isEmpty(args)) return;
    const { quizService } = get(thunkAPI, 'extra') as APIMapping;

    const { data } = args;
    const response = await quizService.saveResult(data);
    return response.data;
  }
);

export const saveResultBuilder = (builder: ActionReducerMapBuilder<any>) => {
  builder.addCase(saveResult.pending, (state: any, action: any) => {
    const { requestId } = action.meta;
    set(state, 'loading', 'pending');
    set(state, 'error', null);
    set(state, 'currentRequestId', requestId);
  });

  builder.addCase(saveResult.fulfilled, (state: any, action: any) => {
    set(state, 'loading', 'idle');
    set(state, 'currentRequestId', undefined);
  });

  builder.addCase(saveResult.rejected, (state: any, action) => {
    const { error } = action;
    set(state, 'loading', 'idle');
    set(state, 'error', error);
    set(state, 'currentRequestId', undefined);
  });
};
