import { useEffect, useState } from 'react';
import { GridSortItem } from '@mui/x-data-grid';
import useAppSelector from './useAppSelector';
import useAppDispatch from './useAppDispatch';
import { getVirtualAccountsAction } from '../store/actions/autoHyveActions';
import { clearVirtualAccountsStatus } from '../store/reducers/autoHyveReducer';

export default function useVirtualAccounts() {
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<readonly any[]>([]);
  const [sortModel, setSortModel] = useState<GridSortItem[]>([
    {
      field: 'creationDate',
      sort: 'asc',
    },
  ]);
  const [_startDate, _setStartDate] = useState<string>("");
  const [_endDate, _setEndDate] = useState<string>("");
  const [reloadTable, setReloadTable] = useState<boolean>(false);

  const autoHyveReducer = useAppSelector(state => state.autoHyveReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearVirtualAccountsStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    if (autoHyveReducer.getVirtualAccountsStatus === 'idle' || _startDate || _endDate || reloadTable) {
      dispatch(getVirtualAccountsAction({startDate: _startDate, endDate: _endDate}));
    }
  }, [autoHyveReducer.getVirtualAccountsStatus, dispatch, _startDate, _endDate, reloadTable]);

  useEffect(() => {
    if (autoHyveReducer.getVirtualAccountsStatus === 'loading') {
      setLoading(true);
    }
  }, [autoHyveReducer.getVirtualAccountsStatus, dispatch]);

  useEffect(() => {
    if (autoHyveReducer.getVirtualAccountsStatus === 'completed') {
      setLoading(false);
      setRows(autoHyveReducer.accounts.accounts);
      _setEndDate("")
      _setStartDate("")
      setReloadTable(false)
    }
  }, [autoHyveReducer.accounts.accounts, autoHyveReducer.getVirtualAccountsStatus]);

  useEffect(() => {
    if (autoHyveReducer.getVirtualAccountsStatus === 'failed') {
      setLoading(true);
    }
  }, [autoHyveReducer.getVirtualAccountsStatus]);

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
    _setStartDate,
    _setEndDate,
    setReloadTable
  };
}
