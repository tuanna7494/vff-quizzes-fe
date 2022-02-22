import { handleOutputLimitMessage } from 'utils';

export const VALID = {
  FIELD_REQUIRED: 'The field is required!',
  FIRST_NAME_REQUIRED: 'First Name is required!',
  LAST_NAME_REQUIRED: 'Last Name is required!',

  EMAIL_REQUIRED: 'Email is required!',
  EMAIL_FORMAT: 'Must be a valid email',

  PASSWORD_REQUIRED: 'Password is required!',
  PASSWORD_CONFIRM_REQUIRED: 'Password Confirm is required!',
  PASSWORD_NOT_MATCH: 'Passwords must match',
  PASSWORD_FORMAT:
    'Must Contain 8 Characters. One Uppercase. One Lowercase. One Number and one special case Character',
  PASSWORD_REG:
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,

  MESSAGE_REQUIRED: 'Message is required!',

  MAX_LENGTH_4: handleOutputLimitMessage(4),
  MAX_LENGTH_12: handleOutputLimitMessage(12),
  MAX_LENGTH_20: handleOutputLimitMessage(20),
  MAX_LENGTH_30: handleOutputLimitMessage(30),
  MAX_LENGTH_40: handleOutputLimitMessage(40),
  MIN_LENGTH_8: handleOutputLimitMessage(8, 'min'),

  DATE_BETWEEN: "End date can't be before Start date",
  INPUT_TYPE_NUMBER: 'Amount must be a number'
};
