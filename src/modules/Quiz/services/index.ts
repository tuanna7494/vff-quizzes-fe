import { apiService } from 'common/services';
import { QUIZ_API } from '../constants';
import { IShareResult } from '../types';

class QuizService {
  /**
   * fetchQuiz
   * @param requestBody
   */
  fetchQuiz() {
    return apiService.get(`${QUIZ_API}`);
  }

  /**
   * getQuizById
   * @param quizId
   * @param requestBody
   * @returns
   */
  getQuizByUserId(requestBody) {
    return apiService.get(`${QUIZ_API}/get-created-quizzes`, requestBody);
  }

  /**
   * addQuiz
   * @param configs
   * @param requestBody
   * @returns void
   */
  addQuiz(configs, requestBody) {
    return apiService.post(QUIZ_API, requestBody, configs);
  }
  /**
   * searchQuiz
   * @param requestBody
   */
  searchQuiz(requestBody) {
    return apiService.get(`${QUIZ_API}/search?title=${requestBody.title}`);
  }

  /**
   * deleteQuiz
   * @param quizId
   * @param requestBody
   * @returns void
   */
  deleteQuiz(quizId, requestBody) {
    return apiService.delete(`${QUIZ_API}/${quizId}`, requestBody);
  }

  /**
   * updatequizz
   * @param quizId
   * @param requestBody
   * @returns void
   */
  updateQuiz(quizId, requestBody, configs) {
    return apiService.put(`${QUIZ_API}/${quizId}`, requestBody, configs);
  }

  /**
   * save result
   * @param requestBody
   * @returns void
   */
  saveResult(requestBody) {
    return apiService.post<IShareResult>(`${QUIZ_API}/saveresult`, requestBody);
  }
}

export const quizService = new QuizService();
