import {
  Card,
  CardHeader,
  Avatar,
  IconButton,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  CardActionArea
} from '@mui/material';
import * as React from 'react';
import { IQuiz } from '../types';
import EditIcon from '@mui/icons-material/Edit';
import NoImage from '@public/images/no-image.png';
import DeleteIcon from '@mui/icons-material/Delete';
import { redirect } from 'utils';
import { isEmpty, isFunction } from 'lodash';

interface QuizCardItem extends IQuiz {
  onlyView?: boolean;
  slug?: string;
  onEditQuiz?: (quizId: any) => void;
  onRemoveQuiz?: (quizId: any) => void;
}

export const QuizCardItem: React.FC<QuizCardItem> = ({
  onlyView = true,
  _id,
  title,
  thumbnail,
  user,
  slug,
  onEditQuiz,
  onRemoveQuiz
}) => {
  const fullName = `${user?.first_name}  ${user?.last_name}`;

  const handleActions = (isEdit: boolean, quizId: any) => {
    if (isEmpty(quizId)) return;
    isEdit && isFunction(onEditQuiz) && onEditQuiz(quizId);
    !isEdit && isFunction(onRemoveQuiz) && onRemoveQuiz(quizId);
  };

  return (
    <Card sx={{ position: 'relative' }}>
      <CardActionArea onClick={() => redirect(`/quiz/${slug}`)}>
        {!onlyView && (
          <CardHeader
            avatar={
              <Avatar src={user?.avatar} sx={{ width: 28, height: 28 }} />
            }
            title={<Typography variant="subtitle1">{fullName}</Typography>}
          />
        )}
        <CardMedia
          component="img"
          height="220"
          image={thumbnail ? thumbnail : NoImage.src}
          alt={title}
        />
        <CardContent
          sx={{ position: 'absolute', bottom: '0', left: 0, width: '100%' }}
        >
          <div className="text-truncate">
            <Typography
              variant="h6"
              title={title}
              sx={{ bgcolor: 'white', display: 'inline', lineHeight: 1.2 }}
            >
              {title}
            </Typography>
          </div>
        </CardContent>
      </CardActionArea>
      {!onlyView && (
        <CardActions sx={{ justifyContent: 'end' }}>
          <IconButton
            aria-label="Edit"
            onClick={() => handleActions(true, _id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="Delete"
            onClick={() => handleActions(false, _id)}
          >
            <DeleteIcon />
          </IconButton>
        </CardActions>
      )}
    </Card>
  );
};
