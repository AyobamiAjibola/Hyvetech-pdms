import { useEffect, useState } from 'react';
import { GridSortItem } from '@mui/x-data-grid';
import useAppSelector from './useAppSelector';
import useAppDispatch from './useAppDispatch';
import { getMainAccountTransactionLogsAction } from '../store/actions/autoHyveActions';
import { clearMainTransactionLogsStatus } from '../store/reducers/autoHyveReducer';

export default function useMainTransactionLogs() {
  const [loading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<readonly any[]>([]);
  const [sortModel, setSortModel] = useState<GridSortItem[]>([
    {
      field: 'realDate',
      sort: 'asc',
    },
  ]);
  const [_startDate, _setStartDate] = useState<string>("");
  const [_endDate, _setEndDate] = useState<string>("");
  const [reloadTable, setReloadTable] = useState<boolean>(false);
  const [error, setIsError] = useState<string | undefined>("");
  const [totalRecordInStore, setTotalRecordInStore] = useState<number>(0);
  const [totalCredit, setTotalCredit] = useState<number>(0);
  const [totalDebit, setTotalDebit] = useState<number>(0);

  const autoHyveReducer = useAppSelector(state => state.autoHyveReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearMainTransactionLogsStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    if (autoHyveReducer.getMainAccountTransactionStatus === 'idle' || _startDate || _endDate || reloadTable) {
      dispatch(getMainAccountTransactionLogsAction({startDate: _startDate, endDate: _endDate}));
    }
  }, [autoHyveReducer.getMainAccountTransactionStatus, dispatch, _startDate, _endDate, reloadTable]);

  useEffect(() => {
    if (autoHyveReducer.getMainAccountTransactionStatus === 'loading') {
      setLoading(true);
    }
  }, [autoHyveReducer.getMainAccountTransactionStatus, dispatch]);

  useEffect(() => {
    if (autoHyveReducer.getMainAccountTransactionStatus === 'completed') {
      setLoading(false);
      setRows(autoHyveReducer.transactionLogsMain.postingsHistory);
      setTotalRecordInStore(autoHyveReducer.transactionLogsMain.totalRecordInStore)
      setTotalCredit(autoHyveReducer.transactionLogsMain.totalCredit)
      setTotalDebit(autoHyveReducer.transactionLogsMain.totalDebit)
      _setEndDate("")
      _setStartDate("")
      setReloadTable(false)
    }
  }, [autoHyveReducer.accounts.accounts, autoHyveReducer.getMainAccountTransactionStatus]);

  useEffect(() => {
    if (autoHyveReducer.getMainAccountTransactionStatus === 'failed') {
      setIsError(autoHyveReducer.getMainAccountTransactionError);
    }
  }, [autoHyveReducer.getMainAccountTransactionStatus]);

  return {
    rows,
    sortModel,
    setSortModel,
    loading,
    _setStartDate,
    _setEndDate,
    setReloadTable,
    totalRecordInStore,
    error,
    totalCredit,
    totalDebit
  };
}
