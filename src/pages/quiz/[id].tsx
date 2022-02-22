import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Stack,
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  Box,
  Paper,
  Link
} from '@mui/material';
import { useAppDispatch } from 'common/hooks';
import { actionsQuiz, IShareResult } from 'modules/Quiz';
import { Layout, GoogleAd, SocialShare } from 'components';
import { isEmpty } from 'lodash';
import { findOcc } from 'utils';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import clsx from 'clsx';
import Image from 'next/image';
import { QuizIcon } from 'icons';
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

export default function QuizDetailPage({ data }) {
  const answerRef = useRef<HTMLDivElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [countClick, setCountClick] = useState<number>(0);
  const [answeredData, setAnsweredData] = useState<IAnsweredQuestion[]>([]);
  const [guestResult, setQuestResult] = useState<IShareResult>();

  const dispatch = useAppDispatch();
  const [result, setResult] = useState({
    resultId: '',
    occurrence: null
  });

  const refs = data?.questions?.reduce((acc, value) => {
    acc[value._id] = React.useRef(); // eslint-disable-line react-hooks/rules-of-hooks
    return acc;
  }, {});

  const domain = process.env.NEXT_PUBLIC_URL;
  const shareLink = `${domain}/quiz/${data.slug}`;

  useEffect(() => {
    function handleResize() {
      const el = answerRef?.current;
      el && el.clientWidth && setWidth(el.clientWidth);
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (
        isFinishedChooseAwnser &&
        remainQuestion.length === 0 &&
        clickedQuestion.length === data.questions.length
      ) {
        resultRef?.current?.scrollIntoView(scrollSetting);
      }
    };
  }, [result]);

  const handleScrollToEl = useCallback(
    elTarget => {
      elTarget && refs[elTarget]?.current?.scrollIntoView(scrollSetting);
    },
    [refs]
  );

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

      const postData = {
        result: maxVal.resultId,
        quizz: data._id
      };

      dispatch(actionsQuiz.saveResult({ data: postData })).then(shareResult => {
        const shareData = shareResult?.payload?.data;
        setQuestResult(shareData);
        setResult(maxVal);
      });
    } else {
      setResult({
        resultId: '',
        occurrence: null
      });
    }
  }, [countClick, data.questions.length, answeredData, data._id, dispatch]);

  const resetQuizz = () => {
    clickedQuestion = [];
    remainQuestion = [];
    isFinishedChooseAwnser = false;
    setAnsweredData([]);
    setCountClick(0);
  };

  /**
   * renderQuizContent
   * @returns void
   */
  const renderQuizContent = () => {
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
          {data.title}
        </Typography>
        <Typography mt={1} mb={3}>
          {data.description}
        </Typography>

        <SocialShare link={shareLink} media={data.thumbnail} />
        {data.thumbnail && (
          <Box mt={2}>
            <Image
              layout="responsive"
              src={data.thumbnail}
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
          <GoogleAd
            dataAdsSlot={data.data_ads_slot}
            dataAdsClient={data.data_ads_client}
          />
        </Box>
      );
    });
  };

  /**
   * renderListAnswers
   * @returns void
   */
  const renderListAnswers = (data, nextQuestion: string | undefined) => {
    if (isEmpty(data.answers)) return;

    return data.answers.map(answer => {
      const hasAnswered = answeredData.find(
        item => item.answerId === answer._id
      );
      const questionHasAnswer = answeredData.find(
        item => item.questionId === data._id
      );

      const onClick = () =>
        data._id !== questionHasAnswer?.questionId
          ? handleSelectAnswer(
              answer._id,
              answer.result,
              data._id,
              nextQuestion
            )
          : undefined;
      if (answer.type === 'text' && answer.title === '') return;
      return (
        <Grid key={answer._id} item xs={6} className="answer-item">
          <Card
            aria-disabled={true}
            id={answer._id}
            ref={answerRef}
            className={clsx(
              'card-answer',
              data._id === questionHasAnswer?.questionId && 'has-selected',
              answer._id === hasAnswered?.answerId && 'selected'
            )}
            sx={{
              bgcolor: data.color_bg_hex,
              color: data.color_text_hex,
              height: width
            }}
            onClick={onClick}
          >
            {answer.type === 'image' && (
              <figure className="thumbnail-centered thumbnail--1x1">
                <img src={answer.thumbnail} alt="thumbnai" />
              </figure>
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
            {hasAnswered?.answerId === answer._id && (
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
    const shareResultLink = `${shareLink}?result=${guestResult?._id}`;
    const resultModal = data.results.find(
      item => item._id == guestResult?.result
    );

    if (isEmpty(result)) return;
    return data.results.map(item => {
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
                  {data.title}
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

              {item.thumbnail && (
                <figure className="thumbnail-centered thumbnail--4x3">
                  <img src={item.thumbnail} alt="thumbnai" />
                </figure>
              )}
            </Box>
            <CardContent sx={{ pt: '24px' }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Link
                  href="#"
                  underline="always"
                  color="#ffffff"
                  fontWeight="bold"
                  onClick={resetQuizz}
                >
                  Retake
                </Link>
                <Stack direction="row" spacing={1} alignItems="center">
                  <SocialShare
                    link={shareResultLink}
                    media={data.thumbnail}
                    result={resultModal}
                  />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        )
      );
    });
  };

  /**
   * Handle sharign
   */

  const extraMetaTags = () => {
    const customShareResult = data?.guest_result;
    const { title, description } = data;
    let { thumbnail } = data;
    let urlLink = shareLink;

    if (customShareResult) {
      // title = customShareResult.title;
      // description = customShareResult.description;
      thumbnail = customShareResult.thumbnail;
      urlLink = `${shareLink}?result=${customShareResult.relate_id}`;
    }

    return [
      <meta key="og:url" property="og:url" content={urlLink} />,
      <meta key="og:type" property="og:type" content="article" />,
      <meta key="og:title" property="og:title" content={title} />,
      <meta
        key="og:description"
        property="og:description"
        content={description}
      />,
      <meta key="og:image" property="og:image" content={thumbnail} />,

      <meta
        key="twitter:card"
        name="twitter:card"
        content="summary_large_image"
      />,
      <meta
        key="twitter:domain"
        property="twitter:domain"
        content={`${domain}`}
      />,
      <meta key="twitter:url" property="twitter:url" content={urlLink} />,
      <meta key="twitter:title" name="twitter:title" content={title} />,
      <meta
        key="twitter:description"
        name="twitter:description"
        content={description}
      />,
      <meta key="twitter:image" name="twitter:image" content={thumbnail} />
    ];
  };

  if (isEmpty(data)) return null;
  return (
    <Layout
      title="Quizz detail"
      description={data.title}
      extraMetaTags={extraMetaTags()}
    >
      <Container className="quizz-contain">
        <Grid container spacing={2}>
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

export async function getServerSideProps(ctx) {
  const { id, result } = ctx.query;

  const APP_URL = process.env.NEXT_PUBLIC_API_URL;
  let queryURL = `${APP_URL}/quizz/getquizbyslug/${id}`;
  if (result) {
    queryURL = `${APP_URL}/quizz/getquizbyslug/${id}?result=${result}`;
  }

  const res = await fetch(queryURL);
  const { data } = await res.json();

  return {
    props: { data: data }
  };
}
