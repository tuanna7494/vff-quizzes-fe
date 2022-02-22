import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Stack,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Container,
  Box,
  Paper,
  Link,
  Fab
} from '@mui/material';
import { Layout } from 'components';
import { isEmpty } from 'lodash';
import { findOcc } from 'utils';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBack from '@mui/icons-material/ArrowBack';
import clsx from 'clsx';
import Image from 'next/image';
import { QuizIcon } from 'icons';
import { redirect } from 'utils';
import { useAppDispatch } from 'common/hooks';
import { actionsQuiz, useSelectQuizActions } from 'modules/Quiz';
import difference from 'lodash/differenceBy';

const scrollSetting = {
  behavior: 'smooth',
  block: 'start'
} as any;

const clickedQuestion: string[] = [];
let remainQuestion: any = [];
let isFinishedChooseAwnser = false;

interface IAnsweredQuestion {
  questionId: number | string;
  answerId: number | string;
  resultId: number | string;
}

export default function QuizDetailPage() {
  const { editableQuizz: data } = useSelectQuizActions();
  const answerRef = useRef<HTMLDivElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [countClick, setCountClick] = useState<number>(0);
  const [answeredData, setAnsweredData] = useState<IAnsweredQuestion[]>([]);
  const [result, setResult] = useState({
    resultId: '',
    occurrence: null
  });
  const dispatch = useAppDispatch();

  const refs = data?.questions?.reduce((acc, value) => {
    acc[value._id] = React.useRef();  // eslint-disable-line react-hooks/rules-of-hooks
    return acc;
  }, {});

  useEffect(() => {
    function handleResize() {
      const el = answerRef?.current;
      el && el.clientWidth && setWidth(el.clientWidth);
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleScrollToEl = useCallback(
    elTarget => {
      elTarget && refs[elTarget]?.current.scrollIntoView(scrollSetting);
    },
    [refs]
  );

  useEffect(() => {
    return () => {
     if (isFinishedChooseAwnser && 
       remainQuestion.length === 0 && 
       clickedQuestion.length === data.questions.length
       ) {
       resultRef?.current?.scrollIntoView(scrollSetting);
     }
    }
   }, [result])


  const handleScrollToMissingQuestion = useCallback(() => {
    // FIND MISSING QUESTION AND SCROLL INTO IT
    remainQuestion = difference(
      data?.questions?.map(q => q._id),
      clickedQuestion
    );
    if (remainQuestion.length) {
      handleScrollToEl(remainQuestion[0]);
      remainQuestion.shift();
    }
  }, [data.questions, handleScrollToEl]);

  const handleSelectAnswer = useCallback(
    (answerId, resultId, questionId, nextQuestion) => {
      const newData = {
        questionId: questionId,
        answerId: answerId,
        resultId: resultId
      };
      setAnsweredData([...answeredData, newData]);
      clickedQuestion.push(questionId);
      setCountClick(countClick + 1);

      if (nextQuestion && !isFinishedChooseAwnser) {
        handleScrollToEl(nextQuestion._id);
      } else {
        isFinishedChooseAwnser = true;
        handleScrollToMissingQuestion();
      }
    },
    [answeredData, countClick, handleScrollToEl, handleScrollToMissingQuestion]
  );

  useEffect(() => {
    const questionsLength = data?.questions?.length;

    if (countClick >= questionsLength) {
      const result = findOcc(answeredData, 'resultId');
      const maxVal = result.reduce(
        (max: any, obj: any) => (max.occurrence > obj.occurrence ? max : obj),
        0
      );
      setResult(maxVal);
    } else {
      setResult({
        resultId: '',
        occurrence: null
      });
    }
  }, [countClick, data?.questions?.length, answeredData]);

  /**
   * renderQuizContent
   * @returns void
   */
  const renderQuizContent = () => {
    const fullName = `${data?.user?.first_name} ${data?.user?.last_name}`;
    return (
      <>
        <Typography
          component="h1"
          variant="h3"
          sx={{
            fontSize: { xs: '30px', md: '36px' },
            fontWeight: 700
          }}
        >
          {data?.title}
        </Typography>
        <Typography mt={1} mb={3}>
          {data?.description}
        </Typography>

        {data?.user && (
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <Avatar
              alt={fullName}
              src={data?.user?.thumbnail}
              sx={{ width: 50, height: 50 }}
            />
            <Typography>
              by <strong>{fullName}</strong>
            </Typography>
          </Stack>
        )}
        {data?.thumbnail && (
          <Box mt={2}>
            <Image
              layout="responsive"
              src={data?.thumbnail}
              width="100%"
              height="70%"
            />
          </Box>
        )}
      </>
    );
  };

  /**
   *
   * @returns
   */
  const renderListQuestions = () => {
    return data?.questions?.map((question, i) => {
      const nextQuestion = data?.questions[i + 1];
      return (
        <Box
          ref={refs[question._id]}
          key={question._id}
          mt={5}
          mb={{ xs: 10, sm: 16 }}
        >
          <Paper elevation={2}>
            <Typography
              component="h2"
              textAlign="center"
              sx={{
                fontSize: { xs: '24px', md: '32px' },
                fontWeight: 700,
                px: { xs: 2, md: 4 },
                py: { xs: 2, md: 4 },
                bgcolor: question.color_bg_hex,
                color: question.color_text_hex,
                mb: { xs: 2, md: 3 }
              }}
            >
              {question.title}
            </Typography>
          </Paper>

          <Grid container spacing={1.5}>
            {renderListAnswers(question, nextQuestion)}
          </Grid>
        </Box>
      );
    });
  };

  /**
   * renderListAnswers
   * @returns void
   */
  const renderListAnswers = (data, nextQuestion: string | undefined) => {
    if (isEmpty(data?.answers)) return;
    return data?.answers.map(answer => {
      const hasAnswered = answeredData?.find(
        item => item.answerId === answer._id
      );
      const questionHasAnswer = answeredData?.find(
        item => item.questionId === data?._id
      );

      const onClick = () =>
        data?._id !== questionHasAnswer?.questionId
          ? handleSelectAnswer(
              answer._id,
              answer.result,
              data?._id,
              nextQuestion
            )
          : undefined;
      if (answer.type === 'text' && answer.title === '') return;
      return (
        <Grid key={answer._id} item xs={6}>
          <Card
            aria-disabled={true}
            id={answer._id}
            ref={answerRef}
            className={clsx(
              'card-answer',
              data?._id === questionHasAnswer?.questionId && 'has-selected',
              answer._id === hasAnswered?.answerId && 'selected'
            )}
            sx={{
              bgcolor: data?.color_bg_hex,
              color: data?.color_text_hex,
              height: width
            }}
            onClick={onClick}
          >
            {answer.type === 'image' && (
              <Image
                layout="responsive"
                src={answer.thumbnail}
                width="100%"
                height="100%"
              />
            )}

            {answer.type === 'text' && (
              <CardContent className="card-answer-text">
                <Typography
                  component="div"
                  sx={{
                    fontSize: { xs: '20px', md: '28px' },
                    fontWeight: 500
                  }}
                >
                  {answer.title}
                </Typography>
              </CardContent>
            )}
            {answer._id && hasAnswered?.answerId === answer._id && (
              <CheckCircleIcon
                color="success"
                sx={{
                  position: 'absolute',
                  top: { xs: 12, md: 16 },
                  right: { xs: 12, md: 16 },
                  bgcolor: '#fff',
                  borderRadius: '50%',
                  fontSize: { xs: '30px', md: '50px' }
                }}
              />
            )}
          </Card>
        </Grid>
      );
    });
  };
  /**
   * renderContentResult
   * @returns void
   */
  const renderContentResult = () => {
    if (isEmpty(result)) return;
    return data?.results.map(item => {
      return (
        item._id === result?.resultId && (
          <Card key={item._id} className="result">
            <CardContent>
              <Stack direction="row" alignItems="center">
                <div className="quizzIcon">
                  <QuizIcon />
                </div>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  color="white"
                  ml={2}
                >
                  {data?.title}
                </Typography>
              </Stack>
            </CardContent>
            <Box p="20px" mx="20px" bgcolor="#fff" borderRadius="5px">
              <Typography gutterBottom variant="h6" component="h5" mb={0}>
                {item.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={2}>
                {item.description}
              </Typography>
              <CardMedia
                component="img"
                alt={item.title}
                height="320"
                image={item.thumbnail}
              />
            </Box>
            <CardContent>
              <Stack direction="row" justifyContent="space-between">
                <Link
                  href="#"
                  underline="always"
                  color="#ffffff"
                  fontWeight="bold"
                  onClick={() => {
                    setAnsweredData([]);
                    setCountClick(0);
                  }}
                >
                  Retake
                </Link>
                <Stack direction="row" spacing={1} alignItems="center"></Stack>
              </Stack>
            </CardContent>
          </Card>
        )
      );
    });
  };
  return (
    <Layout title="Quizz detail">
      <Container className="quizz-contain">
        <Fab
          color="info"
          size="medium"
          aria-label="back"
          variant="extended"
          className="float-navigation-back"
          onClick={() => {
            dispatch(
              actionsQuiz.updateQuizActions({
                editableQuizz: data,
                isShow: true,
                isAdd: false,
                isPreviewed: true
              })
            );
            redirect('/account/quiz');
          }}
        >
          <ArrowBack />
          <Typography ml={1}>Back to editting quiz</Typography>
        </Fab>
        <Grid container spacing={2} sx={{ marginTop: '20px' }}>
          <Grid item xs={12} md={8} lg={7}>
            {renderQuizContent()}
            {renderListQuestions()}
            <div ref={resultRef} className="result-content">
              {!isEmpty(result.resultId) && renderContentResult()}
            </div>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}
