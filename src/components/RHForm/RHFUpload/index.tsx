import React from 'react';
import { Controller } from 'react-hook-form';
import { RHFInputProps } from '../types';
import { EnhanceDropZone } from 'components';

interface RHFUploadProps extends RHFInputProps {
  id: string;
  name: string;
  previousThumb?: string;
}

export const RHFUpload: React.FC<RHFUploadProps> = ({
  id,
  name,
  control,
  previousThumb,
  ...props
}) => {
  return (
    <Controller
      name={name as string}
      control={control}
      render={({
        field: { onChange, value },
        fieldState: { error },
        formState
      }) => {
        return (
          <EnhanceDropZone
            id={id}
            previousThumb={previousThumb}
            error={error?.message}
            onChange={(e: any) => onChange(e.target.files[0])}
            {...props}
          />
        );
      }}
    />
  );
};
