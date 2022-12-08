import { useEffect, useState } from 'react';
import { IInvoice } from '@app-models';
import useAppDispatch from './useAppDispatch';
import useAppSelector from './useAppSelector';
import { getInvoicesAction } from '../store/actions/invoiceActions';
import { clearGetInvoicesStatus } from '../store/reducers/invoiceReducer';
import { CustomHookMessage } from '@app-types';

export default function useInvoice() {
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [error, setError] = useState<CustomHookMessage>();

  const invoiceReducer = useAppSelector(state => state.invoiceReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (invoiceReducer.getInvoicesStatus === 'idle') {
      void dispatch(getInvoicesAction());
    }
  }, [dispatch, invoiceReducer.getInvoicesStatus]);

  useEffect(() => {
    if (invoiceReducer.getInvoicesStatus === 'completed') {
      setInvoices(invoiceReducer.invoices);
    }
  }, [dispatch, invoiceReducer.getInvoicesStatus, invoiceReducer.invoices]);

  useEffect(() => {
    if (invoiceReducer.getInvoicesStatus === 'failed') {
      setError({ message: invoiceReducer.getInvoicesError });
    }
  }, [dispatch, invoiceReducer.getInvoicesError, invoiceReducer.getInvoicesStatus]);

  useEffect(() => {
    return () => {
      dispatch(clearGetInvoicesStatus());
    };
  }, [dispatch]);

  return {
    invoices,
    error,
    setError,
  };
}
