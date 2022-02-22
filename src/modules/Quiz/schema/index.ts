import { VALID } from 'constants/validate';
import { isArray, isEmpty } from 'lodash';
import * as Yup from 'yup';
import { LIMIT_FILE_SIZE } from '..';

// -- schemaValidateAddQuiz-------------------------------------------------
export const schemaValidateAddQuiz = Yup.object().shape({
  title: Yup.string().required(VALID.FIELD_REQUIRED),
  description: Yup.string().required(VALID.FIELD_REQUIRED),
  thumbnail: Yup.mixed().test(
    'FILE_SIZE',
    'Uploaded file is too big.',
    value => {
      return !isEmpty(value)
        ? isArray(value)
          ? value[0].size < LIMIT_FILE_SIZE
          : true
        : true;
    }
  ),
  results: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required(VALID.FIELD_REQUIRED),
      thumbnail: Yup.mixed().test(
        'FILE_SIZE',
        'Uploaded file is too big.',
        value => {
          return !isEmpty(value)
            ? isArray(value)
              ? value[0].size < LIMIT_FILE_SIZE
              : true
            : true;
        }
      )
    })
  ),
  questions: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required(VALID.FIELD_REQUIRED)
    })
  )
});
