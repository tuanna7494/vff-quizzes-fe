import React, { useCallback } from 'react';
import { useFieldArray } from 'react-hook-form';
import {
  Box,
  Button,
  CircularProgress,
  FormGroup,
  Grid,
  IconButton,
  Stack,
  Typography
} from '@mui/material';
import { RHFTextInput, RHFSelect, EnhanceImage } from 'components';
import AddBoxIcon from '@mui/icons-material/AddBox';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ImageIcon from '@mui/icons-material/Image';
import { getToken } from 'common/localStorage';
import { actionsApp, useSelectAppStore } from 'modules/App';
import { useAppDispatch } from 'common/hooks';
import { useSnackbar } from 'notistack';

const fileLimitSize = (process.env.uploadSizeLimit as any) || 2097152;

export default function FormAnswer({
  nestIndex,
  control,
  watch,
  register,
  setValue,
  getValues
}) {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { loading } = useSelectAppStore();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions[${nestIndex}].answers`
  });

  /**
   * Watch data
   */
  const watchAnswer = watch(`questions[${nestIndex}].answers`);
  const answerFields: any =
    watchAnswer &&
    fields?.map((field, index) => {
      return {
        ...field,
        ...watchAnswer[index],
        error: false
      };
    });

  /**
   * handleUploadApi
   */
  const handleUploadApi = useCallback(
    async (thumbnail, index) => {
      const token = getToken();
      await dispatch(
        actionsApp.upload({
          token: token,
          data: thumbnail
        })
      )
        .unwrap()
        .then(({ data }) => {
          if (data) {
            setValue(
              `questions[${nestIndex}].answers[${index}].thumbnail`,
              data.path
            );
            setValue(`questions[${nestIndex}].answers[${index}].type`, 'image');
          }
        })
        .catch(err => {
          enqueueSnackbar('Upload failed!', { variant: 'error' });
        });
    },
    [dispatch, setValue, nestIndex, enqueueSnackbar]
  );

  /**
   * showError
   */
  const showError = useCallback(() => {
    enqueueSnackbar(
      `File is larger than ${(fileLimitSize / 1048576).toFixed()}MB`,
      { variant: 'error' }
    );
  }, [enqueueSnackbar]);

  /**
   * handleOnChange
   * @param e
   * @param index
   */
  const handleOnChange = (e, index) => {
    const file = e.target.files;
    const currSize = file[0].size;
    if (currSize > fileLimitSize) {
      setValue(`questions.${nestIndex}.answers.${index}.thumbnail`, '');
      showError();
    } else {
      handleUploadApi(file[0], index);
    }
    e.target.value = '';
  };

  const questionValues = getValues('questions');
  const resultValues = getValues('results');

  const optionsSelect = resultValues.map((item, i) => ({
    value: `${i}`,
    text: item.title
  }));

  return (
    <Grid container spacing={1.5}>
      {answerFields?.map((answer: any, index) => (
        <Grid key={answer.id} item xs={6}>
          <FormGroup sx={{ position: 'relative' }}>
            {answerFields.length !== 1 && (
              <IconButton
                aria-label="delete"
                size="large"
                onClick={() => remove(index)}
                sx={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  zIndex: 10
                }}
              >
                <HighlightOffIcon
                  sx={{
                    fontSize: 30,
                    color: answer.thumbnail === '' ? '#FFF' : '#2196F3'
                  }}
                />
              </IconButton>
            )}
            {answer?.thumbnail !== '' ? (
              loading === 'pending' ? (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height="262px"
                  border={'1px solid #d9d9d9'}
                  borderBottom={0}
                  bgcolor="rgb(0 0 0 / 35%)"
                >
                  <CircularProgress sx={{ color: ' #fff ' }} />
                </Box>
              ) : (
                <EnhanceImage
                  size="1x1"
                  imageUrl={answer.thumbnail}
                  sx={{ border: '1px solid #d9d9d9', borderBottom: 0 }}
                />
              )
            ) : (
              <RHFTextInput
                id={`questions${nestIndex}-answers${index}-title`}
                name={`questions.${nestIndex}.answers.${index}.title`}
                margin="none"
                variant="outlined"
                placeholder="Enter answer title"
                control={control}
                fullWidth
                multiline
                rows={6}
                InputProps={{
                  sx: {
                    height: '262px',
                    fontSize: 18,
                    px: 3,
                    py: 5,
                    color: questionValues[nestIndex].color_text_hex,
                    bgcolor: questionValues[nestIndex].color_bg_hex,
                    '&:focus': {
                      borderCollapse: 'transparent'
                    },
                    borderRadius: 0
                  }
                }}
              />
            )}

            <Stack direction="row">
              <RHFSelect
                id={`questions${nestIndex}-answers${index}-result_idx`}
                name={`questions.${nestIndex}.answers.${index}.result_idx`}
                margin="none"
                variant="outlined"
                control={control}
                options={optionsSelect}
                placeholder="Choose an result"
                fullWidth
                size="small"
                InputProps={{
                  sx: { borderRadius: 0 }
                }}
              />
              <label
                htmlFor={`questions${nestIndex}-answers${index}-thumbnail`}
              >
                <input
                  id={`questions${nestIndex}-answers${index}-thumbnail`}
                  name={`questions.${nestIndex}.answers.${index}.thumbnail`}
                  accept="image/*"
                  type="file"
                  {...register(
                    `questions.${nestIndex}.answers.${index}.thumbnail`,
                    {
                      onChange: e => handleOnChange(e, index)
                    }
                  )}
                  style={{ display: 'none' }}
                />
                <IconButton
                  color="secondary"
                  component="span"
                  sx={{
                    height: '40px',
                    borderRadius: 0,
                    border: '1px solid #d9d9d9',
                    borderLeft: 0
                  }}
                >
                  <ImageIcon color="primary" />
                </IconButton>
              </label>
            </Stack>
          </FormGroup>
        </Grid>
      ))}
      <Grid item xs={6}>
        <Button
          type="button"
          color="inherit"
          variant="contained"
          fullWidth
          onClick={() =>
            append({
              title: '',
              type: 'text',
              result_idx: 0,
              thumbnail: ''
            })
          }
          sx={{ textTransform: 'capitalize', height: '262px' }}
        >
          <Stack alignItems="center">
            <AddBoxIcon color="primary" sx={{ fontSize: 40 }} />
            <Typography color="primary" mt={1} sx={{ fontWeight: 700 }}>
              Add Answer
            </Typography>
          </Stack>
        </Button>
      </Grid>
    </Grid>
  );
}
