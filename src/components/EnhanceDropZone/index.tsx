import React, { useMemo } from 'react';
import { isEmpty } from 'lodash';
import { useDropzone } from 'react-dropzone';
import { Box, FormHelperText, Typography } from '@mui/material';
import { theme } from 'themes';
import { classes } from './styles';
import { RHFHelperText } from 'components';

// Config dropzone
const acceptFile = process.env.uploadAcceptType || 'image/jpeg, image/png';
const fileLimitSize = (process.env.uploadSizeLimit as any) || 2097152;
interface EnhanceDropZoneProps {
  id: string;
  previousThumb?: string | undefined;
  onChange: (...event: any[]) => void;
  error: string | undefined;
}
export const EnhanceDropZone: React.FC<EnhanceDropZoneProps> = ({
  id,
  previousThumb,
  onChange,
  error,
  ...rest
}) => {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    acceptedFiles,
    fileRejections
  } = useDropzone({
    accept: acceptFile,
    multiple: false,
    maxSize: fileLimitSize
  });

  // Handle style
  const style = useMemo(
    () => ({
      ...classes.root,
      ...(isDragActive ? classes.active : {}),
      ...(isDragAccept ? classes.accept : {}),
      ...(isDragReject || error ? classes.reject : {})
    }),
    [isDragActive, isDragReject, isDragAccept, error]
  ) as any;

  // Handle show item
  const acceptedFileItems: any[] = acceptedFiles.map((file, i) => {
    return (
      <div key={i} className="upload-thumbnail" style={classes.thumb}>
        <div className="upload-thumbnail-item" style={classes.thumbInner}>
          <img
            className="upload-image"
            src={URL.createObjectURL(file)}
            style={classes.img as any}
          />
        </div>
      </div>
    );
  });

  // Handle show error
  const fileRejectionItems: any[] = fileRejections.map(({ file, errors }, i) =>
    file.size > fileLimitSize ? (
      <RHFHelperText
        key={i}
        text={`File is larger than ${(fileLimitSize / 1048576).toFixed()}MB`}
      />
    ) : (
      errors.map(e => <RHFHelperText key={e.code} text={e.message} />)
    )
  );

  return (
    <div className="container-upload-file">
      <div {...getRootProps({ style })}>
        <input {...getInputProps({ onChange })} />
        {isEmpty(acceptedFileItems) &&
          (isDragActive ? (
            <Typography variant="caption">Drop the files here ...</Typography>
          ) : (
            isEmpty(previousThumb) &&
            isEmpty(acceptedFileItems) && (
              <>
                <div className="upload-btn" style={classes.btnUpload}>
                  Upload
                </div>
                <Typography variant="caption">or drag and drop</Typography>
              </>
            )
          ))}

        {!isEmpty(previousThumb) && isEmpty(acceptedFileItems) ? (
          <div style={classes.thumb}>
            <div style={classes.thumbInner}>
              <img src={previousThumb} style={classes.img as any} />
            </div>
          </div>
        ) : (
          <aside style={classes.thumbsContainer as any}>
            {acceptedFileItems}
          </aside>
        )}
      </div>

      <Box id={`EnhanceDropZone-${id}`} display="flex">
        <FormHelperText component="div" error sx={{ flex: 1 }}>
          {!isEmpty(fileRejectionItems) && fileRejectionItems}
          {!isEmpty(error) && error}
        </FormHelperText>
        <Typography
          variant="body2"
          align="right"
          sx={{ ml: 'auto', mt: 0.5, color: theme.palette.text.disabled }}
        >
          {process.env.uploadAcceptType}
        </Typography>
      </Box>
    </div>
  );
};
