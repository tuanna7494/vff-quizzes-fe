import React, { useEffect } from 'react';
import { DataNotFound, Layout } from 'components';
import { Container, Grid } from '@mui/material';
import {
  actionsQuiz,
  IQuiz,
  QuizCardItem,
  useSelectQuizzStore
} from 'modules/Quiz';
import { useAppDispatch } from 'common/hooks';
import { isEmpty } from 'lodash';

export default function HomePage() {
  const dispath = useAppDispatch();
  const { entities } = useSelectQuizzStore();

  useEffect(() => {
    dispath(actionsQuiz.fetchQuiz(null));
  }, [dispath]);

  const renderListQuiz = () => {
    return (
      <Grid container spacing={3}>
        {entities.map(
          (item: IQuiz) =>
            item.enabled && (
              <Grid key={item._id} item xs={12} sm={6} md={4} lg={3}>
                <QuizCardItem {...item} onlyView={true} />
              </Grid>
            )
        )}
      </Grid>
    );
  };

  return (
    <Layout
      title="Quiz"
      description="From Unique Nail Quizzes To So Much More, Quizzes made with love at Garys Luxury"
    >
      <Container>
        <div style={{marginBottom: '20px'}}>
          <h1>Garys Quizzes</h1>
          <p>From Unique Nail Quizzes To So Much More, Quizzes made with love at Garys Luxury</p>
        </div>
        {!isEmpty(entities) ? renderListQuiz() : <DataNotFound />}
      </Container>
    </Layout>
  );
}
