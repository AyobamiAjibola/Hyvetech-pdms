import { useCallback, useEffect, useState } from 'react';
import { IInvoice } from '@app-models';
import useAppDispatch from './useAppDispatch';
import useAppSelector from './useAppSelector';
import { getInvoicesAction } from '../store/actions/invoiceActions';
import { clearGetInvoicesStatus } from '../store/reducers/invoiceReducer';
import { CustomHookMessage } from '@app-types';
import estimateModel, { IEstimateValues, ILabour, IPart } from '../components/forms/models/estimateModel';

export default function useInvoice() {
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [initialValues, setInitialValues] = useState<IEstimateValues>(estimateModel.initialValues);
  const [labourTotal, setLabourTotal] = useState<number>(0);
  const [partTotal, setPartTotal] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [dueBalance, setDueBalance] = useState<number>(0);
  const [refundable, setRefundable] = useState<number>(0);
  const [success, setSuccess] = useState<CustomHookMessage>();
  const [error, setError] = useState<CustomHookMessage>();
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [showRefund, setShowRefund] = useState<boolean>(false);
  const [estimateId, setEstimateId] = useState<number>();

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

  const onEdit = useCallback(
    (id: number) => {
      const invoice = invoices.find(invoice => invoice.id === id);

      if (invoice && invoice.edited) {
        //use invoice
        const parts = invoice.parts as unknown as IPart[];
        const labours = invoice.labours as unknown as ILabour[];
        const driver = invoice.estimate.rideShareDriver;
        const customer = invoice.estimate.customer;
        const vehicle = invoice.estimate.vehicle;
        const firstName = driver ? driver.firstName : customer.firstName;
        const lastName = driver ? driver.lastName : customer.lastName;
        const phone = driver ? driver.phone : customer.phone;
        const make = vehicle && vehicle.make ? vehicle.make : '';
        const model = vehicle && vehicle.model ? vehicle.model : '';
        const plateNumber = vehicle && vehicle.plateNumber ? vehicle.plateNumber : '';
        const vin = vehicle && vehicle.vin ? vehicle.vin : '';
        const modelYear = vehicle && vehicle.modelYear ? vehicle.modelYear : '';
        const address = invoice.address ? invoice.address : '';
        const addressType = invoice.addressType ? invoice.addressType : '';
        const jobDuration = { count: `${invoice.jobDurationValue}`, interval: invoice.jobDurationUnit };
        const depositAmount = `${invoice.depositAmount}`;
        const tax = `${invoice.tax}`;
        const mileage = {
          count: vehicle && vehicle.mileageValue ? vehicle.mileageValue : '',
          unit: vehicle && vehicle.mileageUnit ? vehicle.mileageUnit : '',
        };
        const status = invoice.estimate.status;

        setInitialValues(prevState => ({
          ...prevState,
          firstName,
          lastName,
          phone,
          make,
          model,
          plateNumber,
          vin,
          modelYear,
          address,
          addressType,
          jobDuration,
          depositAmount,
          tax,
          mileage,
          parts,
          labours,
          status,
        }));

        setGrandTotal(invoice.grandTotal);
        setPartTotal(invoice.partsTotal);
        setLabourTotal(invoice.laboursTotal);
        setDueBalance(invoice.dueAmount);
        setEstimateId(estimateId);
        setShowEdit(true);
      } else if (invoice && !invoice.edited) {
        const estimate = invoice.estimate;

        const driver = estimate.rideShareDriver;
        const customer = estimate.customer;
        const vehicle = estimate.vehicle;
        const parts = estimate.parts as unknown as IPart[];
        const labours = estimate.labours as unknown as ILabour[];
        const firstName = driver ? driver.firstName : customer.firstName;
        const lastName = driver ? driver.lastName : customer.lastName;
        const phone = driver ? driver.phone : customer.phone;
        const make = vehicle && vehicle.make ? vehicle.make : '';
        const model = vehicle && vehicle.model ? vehicle.model : '';
        const plateNumber = vehicle && vehicle.plateNumber ? vehicle.plateNumber : '';
        const vin = vehicle && vehicle.vin ? vehicle.vin : '';
        const modelYear = vehicle && vehicle.modelYear ? vehicle.modelYear : '';
        const address = estimate.address ? estimate.address : '';
        const addressType = estimate.addressType ? estimate.addressType : '';
        const jobDuration = { count: `${estimate.jobDurationValue}`, interval: estimate.jobDurationUnit };
        const depositAmount = `${estimate.depositAmount}`;
        const tax = `${estimate.tax}`;
        const mileage = {
          count: vehicle && vehicle.mileageValue ? vehicle.mileageValue : '',
          unit: vehicle && vehicle.mileageUnit ? vehicle.mileageUnit : '',
        };
        const status = estimate.status;

        setInitialValues(prevState => ({
          ...prevState,
          firstName,
          lastName,
          phone,
          make,
          model,
          plateNumber,
          vin,
          modelYear,
          address,
          addressType,
          jobDuration,
          depositAmount,
          tax,
          mileage,
          parts,
          labours,
          status,
        }));

        setGrandTotal(estimate.grandTotal);
        setPartTotal(estimate.partsTotal);
        setLabourTotal(estimate.laboursTotal);
        setDueBalance(invoice.dueAmount);
        setEstimateId(estimateId);
        setShowEdit(true);
      } else setError({ message: 'An Error Occurred. Please try again or contact support' });
    },
    [estimateId, invoices],
  );

  return {
    invoices,
    error,
    setError,
    onEdit,
    showEdit,
    setShowEdit,
    initialValues,
    labourTotal,
    grandTotal,
    partTotal,
    setSuccess,
    success,
    setLabourTotal,
    setPartTotal,
    setGrandTotal,
    dueBalance,
    setDueBalance,
    refundable,
    setRefundable,
    showRefund,
    setShowRefund,
  };
}
