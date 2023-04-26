/* eslint-disable */
import React, { useEffect, useMemo, useState } from 'react';
import { IItem } from '@app-models';
import { Button, DialogActions, DialogContentText, Grid, Typography } from '@mui/material';
import AppDataGrid from '../../components/tables/AppDataGrid';
import useAppSelector from '../../hooks/useAppSelector';
import AppAlert from '../../components/alerts/AppAlert';
// import moment from 'moment';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { Cancel, Edit } from '@mui/icons-material';
import { Formik } from 'formik';
import AppModal from '../../components/modal/AppModal';
import itemModel from '../../components/forms/models/itemModel';
import useItemStock from '../../hooks/useItemStock';
import useAppDispatch from '../../hooks/useAppDispatch';
import { getItemsAction } from '../../store/actions/itemStockAction';
import { useNavigate } from 'react-router-dom';
import { clearCreateItemStatus, clearGetItemStatus, clearUpdateItemStatus } from '../../store/reducers/itemStockReducer';
import ItemPageContext from '../../context/ItemPageContext';
import ItemForm from '../../components/forms/item/ItemForm';
import AppLoader from '../../components/loader/AppLoader';
import { MESSAGES } from '../../config/constants';
import { reload } from '../../utils/generic';


function ItemsPage() {
  const itemReducer = useAppSelector(state => state.itemStockReducer);
  const dispatch = useAppDispatch();
  const [_item, _setItem] = useState<any>([])
  const navigate = useNavigate()

  const item = useItemStock();

  useEffect(() => {
    const _temp01 = item.items;
    _setItem(_temp01);
  }, [item.items]);

  const techColumns = useMemo(() => {
    return [
      {
        field: 'serialNumber',
        headerName: 'S/NO',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 100,
        renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
      },
      {
        field: 'name',
        headerName: 'Name',
        headerAlign: 'center',
        align: 'center',
        sortable: true,
        type: 'string',
        width: 150,
        renderCell: params => {
          return (
            <span
              style={{ color: 'skyblue', cursor: 'pointer' }}
              onClick={() => {
                void dispatch(getItemsAction());
                navigate(`/items/${params.row.id}`, { state: { item: params.row } });
              }}>
              {params.row.name.toUpperCase()}
            </span>
          );
        },
      },
      {
        field: 'description',
        headerName: 'Description',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 200
      },
      {
        field: 'type',
        headerName: 'Type',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 100
      },
      {
        field: 'slug',
        headerName: 'Part #',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 150
      },
      {
        field: 'sellingPrice',
        headerName: 'Selling Rate/Price',
        headerAlign: 'center',
        align: 'center',
        type: 'number',
        width: 150
      },
      {
        field: 'unit',
        headerName: 'Item Unit',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 100
      },
      {
        field: 'buyingPrice',
        headerName: 'Buying Rate/Price',
        headerAlign: 'center',
        align: 'center',
        type: 'number',
        width: 150
      },
      {
        field: 'quantity',
        headerName: 'Qty in Stock',
        headerAlign: 'center',
        align: 'center',
        type: 'number',
        width: 100,
        renderCell: params => {
          return (
            <>
              {params.row.quantity < 0
                ? <span style={{color: 'red'}}>{params.row.quantity}</span>
                : <span>{params.row.quantity}</span>
              }
            </>
          )
        }
      },
      {
        field: 'actions',
        type: 'actions',
        headerAlign: 'center',
        align: 'center',
        getActions: (params: any) => {
          const row = params.row as IItem;

          return [
            <GridActionsCellItem
              key={1}
              icon={<Edit sx={{ color: 'limegreen' }} />}
              onClick={() => item.onEdit(row.id)}
              label="Edit"
              showInMenu={false}
            />,
            <GridActionsCellItem
              key={2}
              icon={<Cancel sx={{ color: 'indianred' }} />}
              onClick={() => item.onDelete(row.id)}
              label="Delete"
              showInMenu={false}
            />,
          ];
        },
      },
    ] as GridColDef<IItem>[];
  }, [ dispatch, navigate, item]);

  useEffect(() => {
    return () => {
      dispatch(clearCreateItemStatus());
      dispatch(clearUpdateItemStatus());
      dispatch(clearGetItemStatus());
    };
  }, [dispatch]);

  return (
    <ItemPageContext.Provider
      value={{
        items: item.items,
        setItems: item.setItems,
        showCreate: item.showCreate,
        setShowCreate: item.setShowCreate,
        showEdit: item.showEdit,
        setShowEdit: item.setShowEdit
      }}
    >
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs={10}>
          <Typography variant="h4" gutterBottom>
            Items & Inventory
          </Typography>
        </Grid>
        <Grid item>
          <Button variant="outlined" color="success" size="small" onClick={() => item.setShowCreate(true)}
            sx={{
              mb: {sm: 0, xs: 2}
            }}
          >
            New Item
          </Button>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <AppDataGrid
            rows={item.items}
            columns={ techColumns }
            showToolbar
            loading={itemReducer.getItemsStatus === 'loading'}
          />
        </Grid>
      </Grid>
      <AppAlert
        alertType="success"
        show={undefined !== item.success}
        message={item.success?.message}
        onClose={() => item.setSuccess(undefined)}
      />
      <AppAlert
        alertType="error"
        show={undefined !== item.error}
        message={item.error?.message}
        onClose={() => item.setError(undefined)}
      />
      <AppAlert
        alertType="error"
        show={undefined !== item.error}
        message={item.error?.message}
        onClose={() => item.setError(undefined)}
      />
      {item.showCreate && (
        <AppModal
          fullWidth
          size={document.documentElement.clientWidth > 375 ? "xl" : undefined}
          fullScreen={true}
          show={item.showCreate}
          Content={
            <Formik
              initialValues={item.initialValues}
              validationSchema={itemModel.schema}
              validateOnChange
              onSubmit={(values, formikHelpers) => {
                if(item.save) item.handleCreateItem(values, formikHelpers);
              }}>
              <ItemForm
                showCreate={item.showCreate}
                isSubmitting={
                  itemReducer.createItemStatus === 'loading'
                }
                setSave={item.setSave}
              />
            </Formik>
          }
          onClose={() => {item.setShowCreate(false), reload()}}
        />
      )}
      {item.showEdit && (
        <AppModal
          fullWidth
          size={document.documentElement.clientWidth > 375 ? "xl" : undefined}
          fullScreen={true}
          show={item.showEdit}
          Content={
            <Formik
              initialValues={item.initialValues}
              validationSchema={itemModel.schema}
              onSubmit={(values, formikHelpers) => {
                if(!item.save) item.handleUpdateItem(values, formikHelpers);
              }}
              enableReinitialize
              validateOnChange>
              <ItemForm
                showEdit={item.showEdit}
                isSubmitting={
                  itemReducer.updateItemStatus === 'loading'
                }
                setSave={item.setSave}
              />
            </Formik>
          }
          onClose={() => {item.setShowEdit(false), reload()}}
        />
      )}
      <AppModal
        fullWidth
        show={item.showDelete}
        Content={<DialogContentText>{MESSAGES.cancelText}</DialogContentText>}
        ActionComponent={
          <DialogActions>
            <Button onClick={() => item.setShowDelete(false)}>Disagree</Button>
            <Button onClick={item.handleDelete}>Agree</Button>
          </DialogActions>
        }
        onClose={() => item.setShowDelete(false)}
      />
      <AppLoader show={itemReducer.deleteItemStatus === 'loading'} />
    </ItemPageContext.Provider>
  )
}

export default ItemsPage;