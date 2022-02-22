import React from 'react';
import { Chip, Divider } from '@mui/material';
import { EnhanceModal } from 'components';
import { MODAL, BUTTON } from 'constants/common';
import FormResult from './FormResult';
import FormQuestion from './FormQuestion';
import { useSelectQuizActions } from 'modules/Quiz';

export default function QuizCreateModal({
  show,
  onToggle,
  getValues,
  control,
  watch,
  errors,
  unregister,
  register,
  setValue
}) {
  const { isAdd } = useSelectQuizActions();
  return (
    <EnhanceModal
      title={isAdd ? MODAL.ADD_NEW_QUESTION : MODAL.EDIT_QUESTION}
      open={show}
      onOk={() => onToggle(false)}
      okText={BUTTON.CLOSE}
      variant="primary"
    >
      <FormResult
        {...{
          control,
          register,
          unregister,
          setValue,
          errors,
          watch
        }}
      />

      <Divider sx={{ my: 7 }}>
        <Chip label="Question" sx={{ px: 12, fontWeight: 500 }} />
      </Divider>

      <FormQuestion
        {...{
          control,
          register,
          getValues,
          watch,
          setValue
        }}
      />
    </EnhanceModal>
  );
}
