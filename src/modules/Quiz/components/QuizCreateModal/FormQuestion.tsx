import { Button, Divider, FormGroup, Grid, Typography } from '@mui/material';
import { BUTTON } from 'constants/common';
import React from 'react';
import { useFieldArray } from 'react-hook-form';
import { RHFRadio, RHFTextInput } from 'components';
import FormAnswer from './FormAnswer';
import { quizColor } from '@mockData/quizColor';

export default function FormQuestion({
  control,
  register,
  getValues,
  setValue,
  watch
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions'
  });

  const questionWatch = watch('questions');
  const questionFields: any =
    questionWatch &&
    fields?.map((field, index) => {
      return {
        ...field,
        ...questionWatch[index]
      };
    });

  return (
    <div className="question">
      {questionFields?.map((question, index) => {
        return (
          <Grid key={question.id} container spacing={1} mb={2}>
            {index !== 0 && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>
            )}
            <Grid item xs={12}>
              <Typography component="h5" variant="h5" textAlign="center">
                Question {index + 1}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <RHFRadio
                id={`questions${index}color_bg_hex`}
                name={`questions.${index}.color_bg_hex`}
                control={control}
                className="mb-0"
                options={quizColor as any}
                sx={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  mt: 2
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormGroup>
                <RHFTextInput
                  id={`questions${index}title`}
                  name={`questions.${index}.title`}
                  margin="normal"
                  variant="outlined"
                  placeholder="Enter question title"
                  control={control}
                  fullWidth
                  multiline
                  rows={3}
                  InputProps={{
                    sx: {
                      fontSize: 20,
                      color: question.color_text_hex,
                      bgcolor: question.color_bg_hex,
                      '&:focus': {
                        borderCollapse: 'transparent'
                      }
                    }
                  }}
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
              <FormAnswer
                nestIndex={index}
                {...{
                  control,
                  register,
                  getValues,
                  setValue,
                  watch
                }}
              />
            </Grid>
            {questionFields.length !== 1 && (
              <Grid item xs={12} mt={2}>
                <Button
                  type="button"
                  color="error"
                  variant="outlined"
                  fullWidth
                  onClick={() => remove(index)}
                >
                  {BUTTON.REMOVE_QUESTION}
                </Button>
              </Grid>
            )}
          </Grid>
        );
      })}
      <Button
        type="button"
        color="info"
        variant="contained"
        fullWidth
        onClick={() =>
          append({
            title: '',
            color_bg_hex: '#d32f2f',
            color_text_hex: '#FFF',
            answers: [
              {
                title: '',
                type: 'text',
                result_idx: 0,
                thumbnail: ''
              }
            ]
          })
        }
      >
        {BUTTON.ADD_ANOTHER_QUESTION}
      </Button>
    </div>
  );
}
