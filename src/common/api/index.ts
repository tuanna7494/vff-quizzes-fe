import { appService } from 'modules/App';
import { authService } from 'modules/Auth';
import { quizService } from 'modules/Quiz';
import { userService } from 'modules/Users';

export const apiMapping = {
  authService,
  userService,
  quizService,
  appService
};
export { authService };

export type APIMapping = typeof apiMapping;
