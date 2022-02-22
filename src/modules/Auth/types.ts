import { IUser } from 'modules/Users';

export interface IAuthProps {
  children: React.ReactNode;
}

export interface IAuthState {
  currentUser: IUser;
  loading: 'idle' | 'pending';
  currentRequestId: string | undefined;
  error: any;
}

export interface ILoginForm {
  email: string;
  password: string;
}

export interface IRegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  passwordConfirm: string;
  confirmPassword: string;
}
