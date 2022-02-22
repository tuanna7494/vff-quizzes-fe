import { Typography, Box } from '@mui/material';
import { id } from 'date-fns/locale';
import { isArray, isEmpty } from 'lodash';
import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { DropzoneOptions, useDropzone } from 'react-dropzone';
import { theme } from 'themes';
import { classes } from './styles';

interface RHFUpload2Props extends DropzoneOptions {
  name: string;
  register?: any;
  unregister?: any;
  setValue?: any;
  watch?: any;
}
export const RHFUpload2: FC<RHFUpload2Props> = ({
  name,
  accept,
  maxSize,
  register,
  unregister,
  setValue,
  errors,
  watch,
  ...props
}) => {
  const files: File[] = watch(name as any);
  const acceptFile = process.env.uploadAcceptType || 'image/jpeg, image/png';
  const fileLimitSize = (process.env.uploadSizeLimit as any) || 2097152;
  console.log(errors);

  const onDrop = useCallback(
    droppedFiles =>
      setValue(name as any, droppedFiles, { shouldValidate: true }),
    [setValue, name]
  );

  /**
   * deleteFile
   * @param e
   * @param file
   */
  // const deleteFile = useCallback(
  //   (e, file) => {
  //     e.preventDefault();
  //     if (previousThumb) {
  //       setFiles(null);
  //       setValue(name, null);
  //       return;
  //     }
  //     const newFiles = [...files];
  //     newFiles.splice(newFiles.indexOf(file), 1);

  //     if (newFiles.length > 0) {
  //       setFiles(newFiles);
  //     } else {
  //       setFiles(null);
  //       setValue(name, null);
  //     }
  //   },
  //   [files, name, setValue, previousThumb]
  // );
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    onDrop,
    accept: accept ? accept : acceptFile,
    maxSize: maxSize ? maxSize : fileLimitSize,
    ...props
  });

  const style = useMemo(
    () => ({
      ...classes.root,
      ...(isDragActive ? classes.active : {}),
      ...(isDragAccept ? classes.accept : {}),
      ...(isDragReject ? classes.reject : {})
    }),
    [isDragActive, isDragReject, isDragAccept]
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

      <Box id={`EnhanceDropZone-${id}`} display="flex">
        {/* <FormHelperText component="div" error sx={{ flex: 1 }}>
          {!isEmpty(fileRejectionItems) && fileRejectionItems}
        </FormHelperText> */}
        <Typography
          variant="caption"
          align="right"
          sx={{ ml: 'auto', mt: 0.5, color: theme.palette.text.disabled }}
        >
          {process.env.uploadAcceptType}
        </Typography>
      </Box>
    </div>
  );
};
