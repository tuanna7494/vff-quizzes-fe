// import { PayloadAction } from '@reduxjs/toolkit';
import { set } from 'lodash';
import { IQuizState } from '../../types';

export const defaultState: IQuizState = {
  entities: [],
  quizActions: {
    isShow: false,
    isAdd: true,
    isEdit: false,
    editableQuizz: {}
  },
  loading: 'idle',
  currentRequestId: undefined,
  error: null
};

const reducers = {
  clearState: (state: IQuizState) => {
    set(state, 'entities', []);
    set(state, 'quizActions', {
      isShow: false,
      isAdd: true,
      isEdit: false,
      editableQuizz: {}
    });
  },
  updateQuizActions: (state: IQuizState, action) => {
    const { payload } = action;
    set(state, 'quizActions', { ...state.quizActions, ...payload });
  }
};

export default reducers;
