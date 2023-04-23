import { CustomHookMessage } from '@app-types';
import { Edit, Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Divider, Grid, TextField, Typography } from '@mui/material';
import { Form, useFormikContext } from 'formik';
import React, {
    Dispatch,
  memo,
  SetStateAction,
  useEffect,
  useMemo,
  useState
} from 'react';
// import { FaPlus } from 'react-icons/fa';
import useAppSelector from '../../../hooks/useAppSelector';
import { reload } from '../../../utils/generic';
import AppAlert from '../../alerts/AppAlert';
// import AppModal from '../../modal/AppModal';
import SelectField from '../fields/SelectField';
import itemModel, { IItemValues } from '../models/itemModel';

interface IProps {
  isSubmitting?: boolean;
  showCreate?: boolean;
  showEdit?: boolean;
  setSave: Dispatch<SetStateAction<boolean>>;
}

const { fields } = itemModel

function ItemForm(props: IProps) {
  // @ts-ignore
  const [rawOption, setRawOption] = useState<any>([]);
  const [_error, _setError] = useState<CustomHookMessage>();
  // const [addQty, setAddQty] = useState<boolean>(false)
  const itemReducer = useAppSelector(state => state.itemStockReducer);
  const { values, handleChange, resetForm, errors, touched } = useFormikContext<IItemValues>();
  const { showCreate, showEdit } = props;

  const edit = useMemo(() => {
    return itemReducer.updateItemStatus === 'loading';
  }, [ itemReducer.updateItemStatus]);

  const save = useMemo(() => {
    return itemReducer.createItemStatus === 'loading';
  }, [itemReducer.createItemStatus]);

  useEffect(() => {
    if (!showCreate || !showEdit) {
      resetForm();
    }
  }, [resetForm, showCreate, showEdit]);

  useEffect(() => {
    if (
      itemReducer.updateItemStatus == 'completed' ||
      itemReducer.createItemStatus == 'completed'
    ) {
      reload();
    }
  }, [
    itemReducer.updateItemStatus,
    itemReducer.createItemStatus
  ]);

  useEffect(() => {
    touched.sellingPrice && errors.sellingPrice && _setError({message: errors.sellingPrice});
    touched.buyingPrice && errors.buyingPrice && _setError({message: errors.buyingPrice})
  }, [errors.sellingPrice, errors.buyingPrice])

  return (
    <React.Fragment>
      <Form autoComplete="off" autoCorrect="off">
        <Grid container justifyContent='center' alignItems='center' mb={4}
          sx={{
            gap: 4
          }}
        >
          <Grid item xs={5}>
            <Typography
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                fontSize: 24,
                fontWeight: 500
              }}>
                {showCreate && 'New Item'}
                {showEdit && 'Edit Item'}
            </Typography>
          </Grid>
          <Grid item xs={5}/>
        </Grid>
        <Grid container justifyContent='center' alignItems='center'
          sx={{
            gap: 4
          }}
        >
          <Grid item xs={5} alignSelf="center">
            <Grid item xs={12}>
              <TextField
                value={values.name}
                onChange={handleChange}
                fullWidth
                type='string'
                name={fields.name.name}
                label={fields.name.label}
              />
            </Grid>
            <br />
            <Grid item xs={12}>
              <SelectField
                data={[
                { label: 'part', value: 'part' },
                { label: 'service', value: 'service' }
                ]}
                fullWidth
                label={fields.type.label}
                name={fields.type.name}
                value={values.type}
                type='string'
                onChange={handleChange}
              />
            </Grid>
            <br />
            <Grid item xs={12}>
              <SelectField
                data={[
                { label: 'pcs', value: 'pcs' },
                { label: 'pair', value: 'pair' },
                { label: 'litres', value: 'litres' },
                { label: 'set', value: 'set' },
                { label: 'kg', value: 'kg' },
                { label: 'hrs', value: 'hrs' },
                { label: 'kit', value: 'kit' },
                ]}
                fullWidth
                label={fields.unit.label}
                name={fields.unit.name}
                value={values.unit}
                onChange={handleChange}
                disabled={values.type === 'service'}
              />
            </Grid>
          </Grid>
          <Grid item xs={5} alignSelf="center">
            <Grid item xs={12}>
              <TextField
                onChange={handleChange}
                value={values.sellingPrice}
                name={fields.sellingPrice.name}
                label={fields.sellingPrice.label}
                type="string"
                fullWidth
                inputProps={{
                  min: '1',
                }}
              />
            </Grid>
            <br />
            <Grid item xs={12}>
              <TextField
                value={values.buyingPrice}
                onChange={handleChange}
                fullWidth
                type='string'
                disabled={values.type === 'service'}
                name={fields.buyingPrice.name}
                label={fields.buyingPrice.label}
              />
            </Grid>
            <br />
            <Grid item xs={12}>
              <TextField
                onChange={handleChange}
                value={values.quantity}
                name={fields.quantity.name}
                label={showEdit ? fields.quantity.label : 'Quantity'}
                type="number"
                fullWidth
                disabled={values.type === 'service' || showEdit}
                inputProps={{
                  min: '1',
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid container justifyContent='center' alignItems='center' mt={4} mb={4}
          sx={{gap: 4}}
        >
          <Grid item xs={5}>
            <TextField
              value={values.description}
              onChange={handleChange}
              fullWidth
              multiline
              type='string'
              rows={3}
              name={fields.description.name}
              label={fields.description.label}
            />
          </Grid>
          <Grid xs={5}/>
        </Grid>
        <Grid item xs={12}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Divider sx={{ mb: 3 }} flexItem orientation="horizontal" />
          {showCreate && <LoadingButton
            type="submit"
            size={document.documentElement.clientWidth <= 375 ? 'small' : 'large'}
            loading={save}
            variant="contained"
            color="success"
            endIcon={<Save />}
            onClick={() => {
              props.setSave(true);
            }}
          >
            {'Submit'}
          </LoadingButton>}
          {showEdit && <LoadingButton
            type="submit"
            size={document.documentElement.clientWidth <= 375 ? 'small' : 'large'}
            loading={edit}
            variant="contained"
            color="success"
            endIcon={<Edit />}
            onClick={() => {
              props.setSave(false);
            }}
          >
            {'Save'}
          </LoadingButton>}
        </Grid>
      </Form>
      <AppAlert
        alertType="error"
        show={undefined !== _error}
        message={_error?.message}
        onClose={() => _setError(undefined)}
      />
      {/* {addQty && (
        <AppModal
          fullWidth
          size="md"
          fullScreen={document.documentElement.clientWidth <= 375 ? true : false}
          show={addQty}
          Content={
            <Formik
              initialValues={{}}
              onSubmit={(values, formikHelpers) => {
                console.log(values, formikHelpers);
              }}
              enableReinitialize
              validateOnChange
            >
              <div style={{ marginTop: 20, marginBottom: 20 }}>
                <Typography
                  style={{
                    marginBottom: 20,
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <FaPlus style={{ marginRight: 8 }} />
                  Add Quantity
                </Typography>
                <Grid spacing={document.documentElement.clientWidth <= 375 ? 4 : 10}
                  container
                >
                  <Grid item md={12} xs={12}>
                    <TextField
                      value={name}
                      onChange={e => setName(e.target.value)}
                      fullWidth
                      variant="outlined"
                      name={`name`}
                      label="Expense Type"
                    />
                  </Grid>
                </Grid>
                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                <LoadingButton
                  type="submit"
                  loading={store.createExpenseTypeStatus === 'loading'}
                  disabled={store.createExpenseTypeStatus === 'loading'}
                  onClick={handleCreateExpenseType}
                  variant="contained"
                  color="secondary"
                  endIcon={<Save />}
                >
                  {'Save'}
                </LoadingButton>
              </div>
            </Formik>
          }
          onClose={() => setAddQty(false)}
        />
      )} */}
    </React.Fragment>
  );
}

export default memo(ItemForm);