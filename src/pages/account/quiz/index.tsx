import React, { useEffect, useState } from 'react';
import { Button, Grid, Paper, Typography } from '@mui/material';
import { useAppDispatch } from 'common/hooks';
import { getToken } from 'common/localStorage';
import { DataNotFound, EnhanceModal, Layout } from 'components';
import { BUTTON, MODAL } from 'constants/common';
import { withAuth } from 'hoc';
import { isEmpty } from 'lodash';
import {
  actionsQuiz,
  IQuiz,
  QuizCardItem,
  QuizCreate,
  QuizSearch,
  QUIZ_STATUS,
  useSelectQuizActions,
  useSelectQuizzStore
} from 'modules/Quiz';
import { useSnackbar } from 'notistack';

const QuizPage = () => {
  const token = getToken();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { entities } = useSelectQuizzStore();
  const { isShow } = useSelectQuizActions();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [quizId, setQuizId] = useState<string>('');

  useEffect(() => {
    dispatch(actionsQuiz.fetchQuiz(token));
  }, [dispatch, token]);

  /**
   * handleRemoveQuiz
   */
  const handleRemoveQuiz = async () => {
    setShowModal(false);

    await dispatch(actionsQuiz.deleteQuiz({ token: token, data: quizId }))
      .unwrap()
      .then(async res => {
        enqueueSnackbar(QUIZ_STATUS.REMOVE_QUIZ_SUCCESS);
        setQuizId('');
        await dispatch(actionsQuiz.fetchQuiz(token));
      })
      .catch(err =>
        enqueueSnackbar(QUIZ_STATUS.REMOVE_QUIZ_FAILED, { variant: 'error' })
      );
  };

  /**
   * handleActions
   * @param isDelete
   * @param config
   */
  const handleActions = (isDelete: boolean, config: any) => {
    if (isDelete) {
      setQuizId(config);
      setShowModal(true);
    } else {
      dispatch(actionsQuiz.updateQuizActions(config));
    }
  };

  return (
    <Layout title="Quizzes" variant="auth">
      <Grid container>
        {isShow ? (
          <Grid item xs={12} md={8} mx="auto">
            <QuizCreate />
          </Grid>
        ) : (
          <>
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 2, mb: 4 }}>
                <Grid container spacing={2} justifyContent="space-between">
                  <Grid item xs={12}>
                    <Typography variant="h5">Quizz List</Typography>
                  </Grid>
                  <Grid item xs={12} sm={8} md={5} lg={4}>
                    <QuizSearch />
                  </Grid>
                  <Grid item xs={12} sm={4} md={3}>
                    <Button
                      type="button"
                      color="primary"
                      variant="contained"
                      fullWidth
                      onClick={() =>
                        handleActions(false, {
                          isShow: true,
                          editableQuizz: {}
                        })
                      }
                    >
                      {BUTTON.ADD_NEW_QUIZ}
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              {!isEmpty(entities) ? (
                <Grid container spacing={3}>
                  {entities.map((item: IQuiz) => (
                    <Grid key={item._id} item xs={12} sm={6} md={4} lg={3}>
                      <QuizCardItem
                        {...item}
                        onlyView={false}
                        onEditQuiz={quizId =>
                          handleActions(false, {
                            isShow: true,
                            isAdd: false,
                            editableQuizz: item
                          })
                        }
                        onRemoveQuiz={quizId => handleActions(true, quizId)}
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <DataNotFound />
              )}
            </Grid>
          </>
        )}
      </Grid>
      <EnhanceModal
        title="Remove Quiz"
        open={showModal}
        onCancel={hide => setShowModal(hide)}
        onOk={() => handleRemoveQuiz()}
        okText="Remove"
        cancelText="Cancel"
        variant="error"
      >
        {MODAL.CONTENT_MODAL_QUIZ_REMOVE}
      </EnhanceModal>
    </Layout>
  );
};
export default withAuth(QuizPage);
