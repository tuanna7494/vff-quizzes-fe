import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  FormGroup,
  Grid,
  InputLabel,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import { useAppDispatch } from 'common/hooks';
import { getToken } from 'common/localStorage';
import {
  RHFHelperText,
  RHFSwitch,
  RHFTextarea,
  RHFTextInput,
  RHFUpload
} from 'components';
import { BUTTON } from 'constants/common';
import { isEmpty, isObject } from 'lodash';
import { actionsApp } from 'modules/App';
import {
  actionsQuiz,
  IQuiz,
  QUIZ_STATUS,
  schemaValidateAddQuiz,
  useSelectQuizActions
} from 'modules/Quiz';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { convertToSlug, redirect, stackCallback } from 'utils';
import QuizCreateModal from './QuizCreateModal';

const defaultValues = {
  title: '',
  slug: '',
  description: '',
  thumbnail: '',
  enabled: false,
  data_ads_client: '',
  data_ads_slot: '',
  user: '',
  results: [{ title: '', description: '', thumbnail: '' }],
  questions: [
    {
      title: '',
      color_bg_hex: '#d32f2f',
      color_text_hex: '#FFF',
      thumbnail: '',
      answers: [
        {
          title: '',
          type: 'text',
          result_idx: 0,
          thumbnail: ''
        }
      ]
    }
  ]
};
export const QuizCreate: React.FC = ({}) => {
  const token = getToken();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [slug, setSlug] = useState('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const { isAdd, editableQuizz } = useSelectQuizActions();
  const editQuizz = { ...editableQuizz };

  if (!isAdd) {
    const cacheResultIdx = {};
    const mappingResults = editQuizz.results.map((result, index) => {
      cacheResultIdx[result._id] = index;
      return {
        ...result,
        image: null
      };
    });
    const mappingQuestions = editQuizz.questions.map((question, index) => {
      return {
        ...question,
        answers: question.answers.map((answer, index) => {
          return {
            ...answer,
            thumb: null,
            result_idx: cacheResultIdx[answer.result]
          };
        })
      };
    });
    editQuizz.results = mappingResults;
    editQuizz.questions = mappingQuestions;
  }

  const {
    control,
    watch,
    register,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isDirty, isSubmitting },
    handleSubmit
  } = useForm<IQuiz>({
    defaultValues: isAdd ? defaultValues : editQuizz,
    resolver: yupResolver(schemaValidateAddQuiz)
  });
  const titleWatch = watch().title;
  const values = getValues();

  useEffect(() => {
    if (isEmpty(titleWatch)) return;
    setSlug(convertToSlug(titleWatch));
  }, [titleWatch]);

  /**
   * Handle upload
   */

  useEffect(() => {
    if (isEmpty(values.thumbnail)) return;
    if (isObject(values.thumbnail)) {
      dispatch(
        actionsApp.upload({
          token: token,
          data: values.thumbnail
        })
      )
        .unwrap()
        .then(({ data }) => {
          data && setValue('thumbnail', data.path);
        })
        .catch(err => {
          enqueueSnackbar('Upload failed!', { variant: 'error' });
        });
    }
  }, [dispatch, token, values.thumbnail, setValue, enqueueSnackbar]);

  const resetQuizAction = {
    isShow: false,
    isAdd: true
  };
  /**
   * onSubmit
   * @param data
   */
  const onSubmit = async (data: IQuiz) => {
    if (isAdd) {
      const slug = convertToSlug(data?.title || '');
      const newData = { ...data, slug: slug };

      await dispatch(actionsQuiz.addQuiz({ token: token, data: newData }))
        .unwrap()
        .then(res => {
          enqueueSnackbar(QUIZ_STATUS.ADD_QUIZ_SUCCESS);
          handleActions(resetQuizAction);
          dispatch(actionsQuiz.fetchQuiz(token));
        });
    } else {
      // EDIT
      await dispatch(
        actionsQuiz.updateQuiz({
          token: token,
          data: data,
          id: editQuizz._id
        })
      )
        .unwrap()
        .then(res => {
          enqueueSnackbar(QUIZ_STATUS.UPDATE_QUIZ_SUCCESS);
          handleActions(resetQuizAction);
          dispatch(actionsQuiz.fetchQuiz(token));
        });
    }
  };

  /**
   * handleActions
   * @param config
   */
  const handleActions = (config: any) => {
    dispatch(actionsQuiz.updateQuizActions(config));
  };

  const handlePreview = () => {
    if (!isEmpty(errors)) return;
    dispatch(actionsQuiz.updateQuizActions({ editableQuizz: values }));
    stackCallback(() => redirect('/quiz/preview'));
  };

  return (
    <>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography component="h1" variant="h5" align="center" mb={4}>
          {`${isAdd ? 'Add New' : 'Edit'} Quiz`}
        </Typography>
        <form
          id="quiz-form"
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormGroup>
                <InputLabel htmlFor="title">Quiz Title</InputLabel>
                <RHFTextInput
                  size="small"
                  id="title"
                  name="title"
                  margin="dense"
                  variant="outlined"
                  placeholder="Enter quiz title"
                  control={control}
                  fullWidth
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
              <FormGroup>
                <InputLabel htmlFor="slug">Quiz Slug</InputLabel>
                <RHFTextInput
                  size="small"
                  id="slug"
                  name="slug"
                  margin="dense"
                  variant="outlined"
                  placeholder="Enter quiz slug"
                  control={control}
                  fullWidth
                  value={slug}
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
              <RHFTextarea
                size="small"
                id="description"
                name="description"
                margin="dense"
                variant="outlined"
                placeholder="Enter quiz description"
                control={control}
                rows={3}
                fullWidth
                valueWatch={watch().description?.length || 0}
              />
            </Grid>

            <Grid item xs={12}>
              <FormGroup>
                <InputLabel htmlFor="thumnail">Quiz Thumbnail</InputLabel>
                <RHFUpload
                  id="thumnail"
                  name="thumbnail"
                  control={control}
                  setError={setError}
                  previousThumb={editQuizz.thumbnail}
                />
              </FormGroup>
              {/* <RHFUpload2
                control={control}
                label="Quiz Thumbnail"
                name="thumbnail"
                setValue={setValue}
                setError={setError}
                watch={watch}
                clearErrors={clearErrors}
                maxSize={2097152}
                multiple={false}
                isEdit={!isAdd}
                previousThumb={!isAdd && values.thumbnail}
              /> */}
            </Grid>
            <Grid item xs={12}>
              <FormGroup>
                <InputLabel htmlFor="enabled">Enabled</InputLabel>
                <RHFSwitch id="enabled" name="enabled" control={control} />
              </FormGroup>
            </Grid>

            <Grid item xs={12}>
              <FormGroup>
                <InputLabel htmlFor="data_ads_client">
                  Data-Ads-Client
                </InputLabel>
                <RHFTextInput
                  size="small"
                  id="data_ads_client"
                  name="data_ads_client"
                  margin="dense"
                  variant="outlined"
                  placeholder="Enter data-adv-client"
                  control={control}
                  fullWidth
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
              <FormGroup>
                <InputLabel htmlFor="data_ads_slot">Data-Ads-Slot</InputLabel>
                <RHFTextInput
                  size="small"
                  id="data_ads_slot"
                  name="data_ads_slot"
                  margin="dense"
                  variant="outlined"
                  placeholder="Enter data-adv-slot"
                  control={control}
                  fullWidth
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
              <FormGroup>
                <InputLabel htmlFor="dataAdvSlot">Quiz Questions</InputLabel>
                <Button
                  type="button"
                  color="info"
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => setShowModal(true)}
                >
                  {isAdd
                    ? BUTTON.ADD_QUESTION_RESULT
                    : BUTTON.EDIT_QUESTION_RESULT}
                </Button>
                {errors?.questions && (
                  <RHFHelperText text="Questions is required" />
                )}
                {errors?.results && (
                  <RHFHelperText text="Results is required" />
                )}
              </FormGroup>
            </Grid>

            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="space-between"
              mt={6}
            >
              <Button
                type="button"
                color="secondary"
                variant="contained"
                onClick={handlePreview}
                disabled={isAdd ? !isDirty : false}
              >
                {BUTTON.PREVIEW}
              </Button>
              <Stack direction="row" spacing={2}>
                <Button
                  type="button"
                  color="inherit"
                  variant="contained"
                  onClick={() =>
                    handleActions({
                      isShow: false,
                      isAdd: true,
                      editableQuizz: {},
                      isPreviewed: false
                    })
                  }
                >
                  {BUTTON.CANCEL}
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  {isAdd ? BUTTON.SUBMIT : BUTTON.UPDATE}
                </Button>
              </Stack>
            </Grid>
          </Grid>
          {showModal && (
            <QuizCreateModal
              show={showModal}
              onToggle={e => setShowModal(e)}
              {...{
                getValues,
                control,
                watch,
                handleSubmit,
                register,
                errors,
                setValue,
                setError,
                clearErrors
              }}
            />
          )}
        </form>
      </Paper>
    </>
  );
};
