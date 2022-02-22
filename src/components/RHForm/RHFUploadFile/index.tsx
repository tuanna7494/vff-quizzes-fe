import { Typography, Box, Stack } from '@mui/material';
import { isArray, isEmpty } from 'lodash';
import { ACCEPT_FILES, LIMIT_FILE_SIZE } from 'modules/Quiz';
import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { DropzoneOptions, useDropzone } from 'react-dropzone';
import { RHFHelperText } from '..';
import { classes } from './styles';

interface RHFUploadFileProps extends DropzoneOptions {
  name: string;
  register?: any;
  unregister?: any;
  setValue?: any;
  watch?: any;
  error?: any;
  nestName?: string;
  nestIndex?: number;
  onUploadApi?: (e) => void;
}
export const RHFUploadFile: FC<RHFUploadFileProps> = ({
  name,
  multiple,
  accept,
  maxSize,
  register,
  unregister,
  setValue,
  error,
  watch,
  nestName,
  nestIndex,
  onUploadApi,
  ...props
}) => {
  console.log(name);

  const files: File[] = watch(name as any);

  const fileSizeText = `File size: ${(LIMIT_FILE_SIZE / 1048576).toFixed()}MB`;
  const fileTypeText = `File type: ${ACCEPT_FILES.replaceAll('image/', '.')}`;
  console.log(files);

  const onDrop = useCallback(
    droppedFiles => {
      setValue(name as any, droppedFiles, { shouldValidate: true });
    },
    [setValue, name]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    onDrop: onDrop,
    noDrag: !multiple,
    multiple: multiple ? multiple : false,
    accept: accept ? accept : ACCEPT_FILES,
    ...props
  });

  const style = useMemo(
    () => ({
      ...classes.root,
      ...(isDragActive ? classes.active : {}),
      ...(isDragAccept ? classes.accept : {}),
      ...(isDragReject || !isEmpty(error) ? classes.reject : {})
    }),
    [isDragActive, isDragReject, isDragAccept, error]
  ) as any;

  useEffect(() => {
    register(name as any);
    return () => {
      unregister(name);
    };
  }, [register, unregister, name]);

  return (
    <div className="upload">
      <div className="upload-form" {...getRootProps({ style })}>
        <input {...getInputProps()} />
        {isEmpty(files) && (
          <div
            className="upload-form-inner"
            style={classes.uploadFormInner as any}
          >
            {isDragActive ? (
              <Typography variant="caption">Drop the files here ...</Typography>
            ) : (
              isEmpty(files) && (
                <>
                  <div style={classes.btnUpload}>Upload</div>
                  <Typography variant="caption">or drag and drop</Typography>
                </>
              )
            )}
          </div>
        )}
        {!!files?.length && (
          <aside style={classes.thumbsContainer as any}>
            {isArray(files) ? (
              files.map(file => {
                return (
                  <div key={file.name} style={classes.thumbItem}>
                    <figure className="thumbnail-centered thumbnail--1x1">
                      <img src={URL.createObjectURL(file)} alt={file.name} />
                    </figure>
                  </div>
                );
              })
            ) : (
              <div style={classes.thumbItem}>
                <figure className="thumbnail-centered thumbnail--1x1">
                  <img src={files} alt="thumbnail" />
                </figure>
              </div>
            )}
          </aside>
        )}
      </div>

      <Box display="flex" justifyContent="space-between">
        {error && (
          <Stack ml={1}>
            <RHFHelperText error text={error.message} />
          </Stack>
        )}
        <Stack ml="auto" flexShrink={0} mt={0.5}>
          <Typography
            color="GrayText"
            variant="caption"
            align="right"
            sx={{ ml: 'auto' }}
          >
            {`${fileSizeText} - ${fileTypeText}`}
          </Typography>
          <Typography
            color="GrayText"
            variant="caption"
            align="right"
            sx={{ ml: 'auto' }}
          ></Typography>
        </Stack>
      </Box>
    </div>
  );
};
