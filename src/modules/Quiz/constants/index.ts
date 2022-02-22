export const ACCEPT_FILES =
  process.env.uploadAcceptType || 'image/jpeg, image/png';
export const LIMIT_FILE_SIZE = (process.env.uploadSizeLimit as any) || 2097152;

export const QUIZ_API = '/quizz';

export const QUIZ_ACTION = {
  FETCH: '/quiz/fetchQuiz',
  DELETE: '/quiz/deleteQuiz',
  GET_BY_ID: '/quiz/getQuizById',
  ADD: '/quiz/addQuiz',
  SEARCH: '/quiz/searchQuiz',
  UPDATE: 'quiz/updateQuiz',
  SAVE_RESULT: '/quiz/saveResult'
};

export const QUIZ_STATUS = {
  ADD_QUIZ_SUCCESS: 'Add Quiz successfull!',
  ADD_QUIZ_FAILED: 'Add Quiz failed!',
  REMOVE_QUIZ_SUCCESS: 'Remove Quiz successfull!',
  REMOVE_QUIZ_FAILED: 'Remove Quiz failed!',
  UPDATE_QUIZ_SUCCESS: 'Update Quiz successfull!',
  UPDATE_QUIZ_FAILED: 'Update Quiz failed!',
  SAVE_RESULT_SUCCESS: 'Save result successfull!',
  SAVE_RESULT_FAILED: 'Save result failed!'
};
