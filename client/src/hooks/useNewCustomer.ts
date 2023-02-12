import { useEffect, useState } from 'react';
import { GridSortItem } from '@mui/x-data-grid';
import useAppSelector from './useAppSelector';
import useAppDispatch from './useAppDispatch';
import { getNewCustomersAction } from '../store/actions/customerActions';
import { clearGetNewCustomersStatus } from '../store/reducers/customerReducer';

export default function useNewCustomer() {
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<readonly any[]>([]);
  const [sortModel, setSortModel] = useState<GridSortItem[]>([
    {
      field: 'id',
      sort: 'asc',
    },
  ]);

  const customerReducer = useAppSelector(state => state.customerReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearGetNewCustomersStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    if (customerReducer.getNewCustomersStatus === 'idle') {
      dispatch(getNewCustomersAction());
    }
  }, [customerReducer.getNewCustomersStatus, dispatch]);

  useEffect(() => {
    if (customerReducer.getNewCustomersStatus === 'loading') {
      setLoading(true);
    }
  }, [customerReducer.getNewCustomersStatus, dispatch]);

  useEffect(() => {
    if (customerReducer.getNewCustomersStatus === 'completed') {
      setLoading(false);
      setRows(customerReducer.customers);
    }
  }, [customerReducer.customers, customerReducer.getNewCustomersStatus]);

  useEffect(() => {
    if (customerReducer.getNewCustomersStatus === 'failed') {
      setLoading(true);
    }
  }, [customerReducer.getNewCustomersStatus]);

  const handleDelete = () => {
    setShowDelete(false);
  };

  return {
    rows,
    sortModel,
    setSortModel,
    loading,
    handleDelete,
    showDelete,
    setShowDelete,
  };
}
