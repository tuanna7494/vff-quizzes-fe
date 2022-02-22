import { ReactNode } from 'react';

export interface IQuizProps {
  children?: ReactNode;
}
export interface IQuizState {
  entities: IQuiz[];
  quizActions: {
    isShow: boolean;
    isAdd: boolean;
    isEdit: boolean;
    editableQuizz: IQuiz;
  };
  loading: 'idle' | 'pending';
  currentRequestId: string | undefined;
  error: any;
}
export interface IQuiz {
  _id?: string | number;
  title?: string;
  slug?: string;
  description?: string;
  thumbnail?: any;
  enabled?: boolean;
  data_ads_client?: string;
  data_ads_slot?: string;
  questions?: IQuestion[];
  results?: IResult[];
  user?: any;
}
export interface IQuestion {
  _id?: string | number;
  title?: string;
  color_bg_hex?: string;
  color_text_hex?: string;
  answers?: IAnswer[];
}
export interface IAnswer {
  _id?: string | number;
  title?: string;
  type?: string;
  result_idx?: string | number;
  thumbnail?: any;
}
export interface IResult {
  title?: string;
  description?: string;
  thumbnail?: any;
}

export interface IQuizSearch {
  title?: string;
}

export interface IShareResult {
  _id?: number;
  result: string;
  quizz: string;
}
