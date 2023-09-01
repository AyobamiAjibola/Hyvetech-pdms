import { useEffect, useState } from 'react';
import { GridSortItem } from '@mui/x-data-grid';
import useAppSelector from './useAppSelector';
import useAppDispatch from './useAppDispatch';
import { getAccountTransactionsFilteredAction } from '../store/actions/autoHyveActions';
import { clearTransactionFilteredAndStatus } from '../store/reducers/autoHyveReducer';

export default function useAccountTransactions() {
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
  const [_accountRef, _setAccountRef] = useState<string | undefined>("");
  const [error, setIsError] = useState<string | undefined>("");
  const [totalRecordInStore, setTotalRecordInStore] = useState<number>(0)

  const autoHyveReducer = useAppSelector(state => state.autoHyveReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearTransactionFilteredAndStatus());
    };
  }, [dispatch]);

  // useEffect(() => {
  //   if(_accountRef) {
  //     console.log(_accountRef, 'how now')
  //     dispatch(getAccountTransactionsFilteredAction({accountRef: _accountRef}));
  //   }
  // },[_accountRef])
  
  // useEffect(() => {
    
  //   if (
  //     autoHyveReducer.getAccountTransactionFilteredStatus === 'idle' ||
  //     _startDate || _endDate || reloadTable
  //   ) {
      
  //     dispatch(getAccountTransactionsFilteredAction({startDate: _startDate, endDate: _endDate, accountRef: _accountRef as string}));
  //   }
  // }, [autoHyveReducer.getAccountTransactionFilteredStatus, dispatch, _startDate, _endDate, reloadTable]);
  useEffect(() => {
    if (_accountRef) {
      
      const shouldFetch =
        autoHyveReducer.getAccountTransactionFilteredStatus === 'idle' ||
        _startDate || _endDate || reloadTable;
  
      if (shouldFetch) {
        dispatch(getAccountTransactionsFilteredAction({
          accountRef: _accountRef,
          startDate: _startDate,
          endDate: _endDate
        }));
      }
    }
  }, [_accountRef, autoHyveReducer.getAccountTransactionFilteredStatus, dispatch, _startDate, _endDate, reloadTable]);
  

  useEffect(() => {
    if (autoHyveReducer.getAccountTransactionFilteredStatus === 'loading') {
      setLoading(true);
    }
  }, [autoHyveReducer.getAccountTransactionFilteredStatus, dispatch]);

  useEffect(() => {
    if (autoHyveReducer.getAccountTransactionFilteredStatus === 'completed') {
      setLoading(false);
      setRows(autoHyveReducer.transactionFiltered.postingsHistory);
      setTotalRecordInStore(autoHyveReducer.transactionFiltered.totalRecordInStore)
      _setEndDate("")
      _setStartDate("")
      setReloadTable(false)
    }
  }, [autoHyveReducer.transactionFiltered.postingsHistory, autoHyveReducer.getAccountTransactionFilteredStatus]);

  useEffect(() => {
    if (autoHyveReducer.getAccountTransactionFilteredStatus === 'failed') {
      setIsError(autoHyveReducer.getAccountTransactionFilteredError);
    }
  }, [autoHyveReducer.getAccountTransactionFilteredStatus]);

  return {
    rows,
    sortModel,
    setSortModel,
    loading,
    _setStartDate,
    _setEndDate,
    setReloadTable,
    _accountRef,
    _setAccountRef,
    error,
    totalRecordInStore
  };
}
