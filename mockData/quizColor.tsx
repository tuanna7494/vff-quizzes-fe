import React from 'react';
import { Radio } from '@mui/material';
import {
  blue,
  green,
  orange,
  pink,
  purple,
  red,
  teal
} from '@mui/material/colors';

const style = {
  width: 60,
  height: 60,
  '& .MuiSvgIcon-root': {
    fontSize: 40
  }
};
export const quizColor = [
  {
    label: '',
    value: red[700],
    control: (
      <Radio
        sx={{
          ...style,
          color: red[900],
          '&.Mui-checked': {
            color: red[900]
          }
        }}
      />
    )
  },
  {
    label: '',
    value: pink[700],
    control: (
      <Radio
        sx={{
          ...style,
          color: pink[900],
          '&.Mui-checked': {
            color: pink[900]
          }
        }}
      />
    )
  },
  {
    label: '',
    value: purple[700],
    control: (
      <Radio
        sx={{
          ...style,
          color: purple[900],
          '&.Mui-checked': {
            color: purple[900]
          }
        }}
      />
    )
  },
  {
    label: '',
    value: blue[700],
    control: (
      <Radio
        sx={{
          ...style,
          color: blue[900],
          '&.Mui-checked': {
            color: blue[900]
          }
        }}
      />
    )
  },
  {
    label: '',
    value: teal[700],
    control: (
      <Radio
        sx={{
          ...style,
          color: teal[900],
          '&.Mui-checked': {
            color: teal[900]
          }
        }}
      />
    )
  },
  {
    label: '',
    value: green[700],
    control: (
      <Radio
        sx={{
          ...style,
          color: green[900],
          '&.Mui-checked': {
            color: green[900]
          }
        }}
      />
    )
  },
  {
    label: '',
    value: orange[700],
    control: (
      <Radio
        sx={{
          ...style,
          color: orange[900],
          '&.Mui-checked': {
            color: orange[900]
          }
        }}
      />
    )
  }
];
