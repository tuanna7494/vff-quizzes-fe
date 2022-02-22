import React from 'react';
import { RHFTextInput } from 'components';
import { actionsQuiz, IQuizSearch } from 'modules/Quiz';
import { useAppDispatch } from 'common/hooks';
import { useForm } from 'react-hook-form';
import { useWindowSize } from 'hooks';

const defaultValues = {
  title: ''
};
export const QuizSearch = () => {
  const { width } = useWindowSize();
  const dispath = useAppDispatch();
  const { control, handleSubmit } = useForm<IQuizSearch>({
    defaultValues: defaultValues
  });

  const onSubmit = async (data: IQuizSearch) => {
    await dispath(actionsQuiz.searchQuiz(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <RHFTextInput
        id="search"
        size="small"
        name="title"
        placeholder="Search..."
        variant="outlined"
        fullWidth
        control={control}
        sx={{
          width: width && width < 376 ? '140px' : undefined
        }}
      />
    </form>
  );
};
