import React, { useEffect } from 'react';
import { useFieldArray } from 'react-hook-form';
import { Button, Divider, FormGroup, Grid, Typography } from '@mui/material';
import { RHFTextarea, RHFTextInput, RHFUpload } from 'components';
import { BUTTON } from 'constants/common';
import { isEmpty, isObject } from 'lodash';
import { actionsApp } from 'modules/App';
import { useAppDispatch } from 'common/hooks';
import { getToken } from 'common/localStorage';
import { useSelectQuizActions } from 'modules/Quiz';
import { useSnackbar } from 'notistack';

export default function FormResult({
  control,
  watch,
  setValue,
  setError,
  clearErrors
}) {
  const dispatch = useAppDispatch();
  const { isAdd } = useSelectQuizActions();
  const { enqueueSnackbar } = useSnackbar();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'results'
  });

  const watchResult = watch('results');
  const resultFields: any =
    watchResult &&
    fields?.map((field, index) => {
      return {
        ...field,
        ...watchResult[index]
      };
    });

  useEffect(() => {
    if (isEmpty(resultFields)) return;
    const token = getToken();

    resultFields.map((item, index) => {
      if (isObject(item.thumbnail)) {
        dispatch(
          actionsApp.upload({
            token: token,
            data: item.thumbnail
          })
        )
          .unwrap()
          .then(
            ({ data }) =>
              data && setValue(`results[${index}].thumbnail`, data.path)
          )
          .catch(err => {
            enqueueSnackbar('Upload failed!', { variant: 'error' });
          });
      }
    });
  }, [dispatch, setValue, resultFields, enqueueSnackbar]);

  return (
    <div className="result">
      {resultFields?.map((item: any, index) => {
        return (
          <Grid key={item.id} container spacing={2} mb={2}>
            {index !== 0 && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>
            )}
            <Grid item xs={12}>
              <Typography component="h5" variant="h5" textAlign="center">
                Result {index + 1}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormGroup>
                <RHFTextInput
                  id={`results${index}-title`}
                  name={`results.${index}.title`}
                  size="small"
                  margin="none"
                  variant="outlined"
                  placeholder="Enter result title"
                  fullWidth
                  control={control}
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
              <RHFTextarea
                size="small"
                id={`results${index}-description`}
                name={`results.${index}.description`}
                margin="none"
                variant="outlined"
                placeholder="Enter result description"
                control={control}
                rows={3}
                fullWidth
                valueWatch={watchResult[index].description?.length || 0}
              />
            </Grid>
            <Grid item xs={12}>
              {/* <RHFUpload2
                control={control}
                name={`results.${index}.thumbnail`}
                setValue={setValue}
                setError={setError}
                watch={watch}
                clearErrors={clearErrors}
                maxSize={2097152}
                multiple={false}
                isEdit={!isAdd}
                previousThumb={!isAdd && item.thumbnail}
              /> */}
              <FormGroup>
                <RHFUpload
                  id={`result${index}-thumbnail`}
                  name={`results.${index}.thumbnail`}
                  control={control}
                  previousThumb={!isAdd && item.thumbnail}
                />
              </FormGroup>
            </Grid>
            {resultFields?.length !== 1 && (
              <Grid item xs={12} mt={2}>
                <Button
                  type="button"
                  color="error"
                  variant="outlined"
                  fullWidth
                  onClick={() => remove(index)}
                >
                  {BUTTON.REMOVE_RESULT}
                </Button>
              </Grid>
            )}
          </Grid>
        );
      })}

      <Button
        type="button"
        color="info"
        variant="contained"
        fullWidth
        onClick={() => append({ title: '', description: '', thumbnail: '' })}
      >
        {BUTTON.ADD_ANOTHER_RESULT}
      </Button>
    </div>
  );
}
