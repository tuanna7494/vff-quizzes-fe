import React, { useMemo } from 'react';
import {
  Box,
  FormHelperText,
  IconButton,
  Stack,
  Typography
} from '@mui/material';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Controller } from 'react-hook-form';
import { classes } from './styles';
import ClearIcon from '@mui/icons-material/Clear';
import { isArray, isEmpty } from 'lodash';

/**
 * 
  <RHFUpload2
    control={control}
    label="Quiz Thumbnail"
    name="thumbnail"
    setValue={setValue}
    setError={setError}
    watch={watch}
    clearErrors={clearErrors}
    maxSize={2097152}
    multiple={false}
    isEdit={!isAdd}
    previousThumb={!isAdd && values.thumbnail}
  />
 *
 */
const acceptFile = process.env.uploadAcceptType || 'image/jpeg, image/png';
const fileLimitSize = (process.env.uploadSizeLimit as any) || 2097152;

export const RHFUpload2 = props => {
  const {
    control,
    label,
    labelClassName,
    name,
    isRequired,
    rules,
    error,
    multiple,
    maxFiles,
    setValue,
    accept,
    maxSize,
    setError,
    clearErrors,
    formGroupClassName,
    watch,
    previousThumb
  } = props;
  const [files, setFiles] = useState(watch(name));
  const fileSizeText = `File size: ${(fileLimitSize / 1048576).toFixed()}MB`;
  const fileTypeText = `File type: ${acceptFile.replaceAll('image/', '.')}`;

  /**
   *
   */
  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles && rejectedFiles.length > 0) {
        setValue(name, []);
        setFiles([]);
        setError(name, {
          type: 'manual',
          message: rejectedFiles && rejectedFiles[0].errors[0].message
        });
      } else {
        setFiles(
          acceptedFiles.map(file =>
            Object.assign(file, {
              preview: URL.createObjectURL(file)
            })
          )
        );
        clearErrors(name);
        acceptedFiles.forEach(file => {
          const reader = new FileReader();
          reader.onabort = () => console.log('File reading was aborted');
          reader.onerror = () => console.log('file reading has failed');
          reader.readAsDataURL(file);
          reader.onloadend = () => {
            setValue(name, file, { shouldValidate: true });
          };
        });
      }
    },
    [name, setValue, setError, clearErrors]
  );

  /**
   * deleteFile
   * @param e
   * @param file
   */
  const deleteFile = useCallback(
    (e, file) => {
      e.preventDefault();
      if (previousThumb) {
        setFiles(null);
        setValue(name, null);
        return;
      }
      const newFiles = [...files];
      newFiles.splice(newFiles.indexOf(file), 1);

      if (newFiles.length > 0) {
        setFiles(newFiles);
      } else {
        setFiles(null);
        setValue(name, null);
      }
    },
    [files, name, setValue, previousThumb]
  );

  console.log(files);
  /**
   * renderImageContent
   * @param file
   * @returns
   */
  const renderImageContent = useCallback(
    (file: any) => {
      if (!file) return;
      return (
        <Box
          className="content-thumb"
          key={file.name}
          sx={{ position: 'relative' }}
        >
          <div style={classes.thumb}>
            <div style={classes.thumbInner}>
              <img
                src={file.preview ? file.preview : file}
                alt={file.name}
                style={classes.img as any}
              />
            </div>
          </div>
          <IconButton
            disableRipple={true}
            sx={{
              position: 'absolute',
              top: 2,
              right: 2
            }}
            onClick={e => deleteFile(e, file)}
          >
            <ClearIcon color="error" />
          </IconButton>
        </Box>
      );
    },
    [deleteFile]
  );

  /**
   * thumbs
   */
  const thumbs =
    !isEmpty(files) &&
    isArray(files) &&
    files.map(file => {
      const ext = file.name && file.name.substr(file.name.lastIndexOf('.') + 1);
      return ext === 'pdf' ? (
        <ul key={file.name} className="mt-2">
          <li>{file.name}</li>
        </ul>
      ) : (
        file && renderImageContent(file)
      );
    });

  /**
   * useEffect
   */
  // useEffect(() => {
  //   if (
  //     watch(name) !== '' &&
  //     typeof watch(name) === 'string' &&
  //     watch(name).startsWith('/')
  //   ) {
  //     setFiles([
  //       {
  //         preview: watch(name),
  //         name: watch(name)
  //           .substr(watch(name).lastIndexOf('/') + 1)
  //           .substr(0, watch(name).lastIndexOf('/'))
  //       }
  //     ]);
  //   }
  // }, [watch, name]);

  // useEffect(
  //   () => () => {
  //     if (!isEmpty(files) && isArray(files) && files.length > 0) {
  //       files?.forEach(file => URL.revokeObjectURL(file.preview));
  //     }
  //   },
  //   [files]
  // );

  /**
   * useDropzone
   */
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    maxFiles: multiple ? maxFiles : 0,
    accept: accept ? accept : acceptFile,
    onDrop,
    minSize: 0,
    maxSize,
    multiple
  });

  /**
   * style
   */
  const style = useMemo(
    () => ({
      ...classes.root,
      ...(isDragActive ? classes.active : {}),
      ...(isDragAccept ? classes.accept : {}),
      ...(isDragReject || error ? classes.reject : {})
    }),
    [isDragActive, isDragReject, isDragAccept, error]
  ) as any;

  return (
    <div className={formGroupClassName || 'container-form-upload'}>
      {label && (
        <label className={labelClassName} htmlFor={name}>
          {label}
          {isRequired && <span style={{ color: 'red' }}> * </span>}
        </label>
      )}
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={controllerProps => (
          <Box {...getRootProps({ style })} {...controllerProps}>
            <input {...getInputProps()} />
            <button type="button" style={classes.btnUpload}>
              Upload
            </button>
            {isDragActive ? (
              <Typography variant="caption">Drop the files here ...</Typography>
            ) : (
              <Typography variant="caption">Select files</Typography>
            )}
          </Box>
        )}
      />

      <Box display="flex" justifyContent="space-between" my={1}>
        <Stack>
          {error && (
            <FormHelperText component="div" error sx={{ flex: 1 }}>
              {error.message}
            </FormHelperText>
          )}
          {previousThumb ? renderImageContent(previousThumb) : thumbs}
        </Stack>
        <Stack ml="auto">
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
