import { RootState } from 'common/redux';
import { IQuizState } from '../../types';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
/**
 * useSelectQuizzStore
 */
const quizSelector = createSelector(
  (state: RootState) => state.quiz,
  (data: IQuizState) => {
    const { entities, error, loading } = data;
    return {
      entities,
      error,
      loading
    };
  }
);

export const useSelectQuizzStore = () => {
  return useSelector<RootState, any>(quizSelector);
};

/**
 * useSelectQuizActions
 */
const quizActionsStateSelector = createSelector(
  (state: RootState) => state.quiz,
  (data: IQuizState) => data.quizActions
);
export const useSelectQuizActions = () => {
  return useSelector<RootState, any>(quizActionsStateSelector);
};
