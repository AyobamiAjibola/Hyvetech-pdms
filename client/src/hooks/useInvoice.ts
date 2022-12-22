import { useCallback, useEffect, useState } from 'react';
import { IInvoice } from '@app-models';
import useAppDispatch from './useAppDispatch';
import useAppSelector from './useAppSelector';
import { getInvoicesAction, saveInvoiceAction, sendInvoiceAction } from '../store/actions/invoiceActions';
import { clearGetInvoicesStatus } from '../store/reducers/invoiceReducer';
import { CustomHookMessage } from '@app-types';
import estimateModel, { IEstimateValues, ILabour, IPart } from '../components/forms/models/estimateModel';
import { initRefundCustomerAction } from '../store/actions/transactionActions';
import { clearSaveEstimateStatus, clearUpdateEstimateStatus } from '../store/reducers/estimateReducer';

const callbackUrl = `${process.env.REACT_APP_ADMIN_BASE_URL}/invoices`;

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
  const [invoiceId, setInvoiceId] = useState<number>();
  const [save, setSave] = useState<boolean>(false);

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
    if (invoiceReducer.saveInvoiceStatus === 'completed') {
      setSuccess({ message: invoiceReducer.saveInvoiceSuccess });
      dispatch(getInvoicesAction());
    }
  }, [dispatch, invoiceReducer.saveInvoiceStatus, invoiceReducer.saveInvoiceSuccess]);

  useEffect(() => {
    if (invoiceReducer.saveInvoiceStatus === 'failed') {
      setError({ message: invoiceReducer.saveInvoiceError });
    }
  }, [dispatch, invoiceReducer.saveInvoiceError, invoiceReducer.saveInvoiceStatus]);

  useEffect(() => {
    if (invoiceReducer.sendInvoiceStatus === 'completed') {
      setSuccess({ message: invoiceReducer.sendInvoiceSuccess });
      dispatch(getInvoicesAction());
    }
  }, [dispatch, invoiceReducer.sendInvoiceStatus, invoiceReducer.sendInvoiceSuccess]);

  useEffect(() => {
    if (invoiceReducer.sendInvoiceStatus === 'failed') {
      setError({ message: invoiceReducer.sendInvoiceError });
    }
  }, [dispatch, invoiceReducer.sendInvoiceError, invoiceReducer.sendInvoiceStatus]);

  useEffect(() => {
    return () => {
      dispatch(clearGetInvoicesStatus());
      dispatch(clearSaveEstimateStatus());
      dispatch(clearUpdateEstimateStatus());
      setSave(false);
      setInvoiceId(undefined);
      setEstimateId(undefined);
      setSuccess(undefined);
      setError(undefined);
      setRefundable(0);
      setGrandTotal(0);
      setPartTotal(0);
      setDueBalance(0);
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
        setRefundable(invoice.refundable);
        setInvoiceId(invoice.id);
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
        setRefundable(invoice.refundable);
        setInvoiceId(invoice.id);
        setEstimateId(estimateId);
        setShowEdit(true);
      } else setError({ message: 'An Error Occurred. Please try again or contact support' });
    },
    [estimateId, invoices],
  );

  const handleInitiateRefund = () => {
    void dispatch(
      initRefundCustomerAction({
        callbackUrl,
        amount: refundable,
        invoiceId,
      }),
    );
  };

  const handleSaveInvoice = (values: IEstimateValues) => {
    const data = {
      id: invoiceId,
      parts: values.parts,
      labours: values.labours,
      tax: values.tax,
      addressType: values.addressType,
      address: values.address,
      depositAmount: values.depositAmount,
      jobDurationValue: values.jobDuration.count,
      jobDurationUnit: values.jobDuration.interval,
      partsTotal: Math.round(partTotal),
      laboursTotal: Math.round(labourTotal),
      grandTotal: Math.round(grandTotal),
      refundable: Math.round(refundable),
    };

    void dispatch(saveInvoiceAction(data));
  };

  const handleSendInvoice = (values: IEstimateValues) => {
    const parts = values.parts;
    const labours = values.labours;

    if (!parts.length) return setError({ message: 'Parts Items Cannot not be empty!' });
    if (!labours.length) return setError({ message: 'Labour Items Cannot not be empty!' });

    const data = {
      id: invoiceId,
      parts: values.parts,
      labours: values.labours,
      tax: values.tax,
      addressType: values.addressType,
      address: values.address,
      depositAmount: values.depositAmount,
      jobDurationValue: values.jobDuration.count,
      jobDurationUnit: values.jobDuration.interval,
      partsTotal: Math.round(partTotal),
      laboursTotal: Math.round(labourTotal),
      grandTotal: Math.round(grandTotal),
      refundable: Math.round(refundable),
    };

    void dispatch(sendInvoiceAction(data));
  };

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
    save,
    setSave,
    handleInitiateRefund,
    handleSaveInvoice,
    handleSendInvoice,
  };
}
