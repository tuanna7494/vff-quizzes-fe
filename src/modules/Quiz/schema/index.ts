import { VALID } from 'constants/validate';
import * as Yup from 'yup';

// -- schemaValidateAddQuiz-------------------------------------------------
export const schemaValidateAddQuiz = Yup.object().shape({
  title: Yup.string().required(VALID.FIELD_REQUIRED),
  description: Yup.string().required(VALID.FIELD_REQUIRED),
  results: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required(VALID.FIELD_REQUIRED)
    })
  ),
  questions: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required(VALID.FIELD_REQUIRED)
    })
  )
});
