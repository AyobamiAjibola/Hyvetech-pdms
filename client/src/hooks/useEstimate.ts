import { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import estimateModel, { IEstimateValues, ILabour, IPart } from '../components/forms/models/estimateModel';
import { createEstimateAction, getEstimatesAction } from '../store/actions/estimateActions';
import useAppSelector from './useAppSelector';
import useAppDispatch from './useAppDispatch';
import { CustomHookMessage, GenericObjectType } from '@app-types';
import { IEstimate, IRideShareDriver } from '@app-models';
import { useParams } from 'react-router-dom';
import cookie from '../utils/cookie';
import settings from '../config/settings';
import { CustomJwtPayload } from '@app-interfaces';
import { clearCreateEstimateStatus, clearGetEstimateStatus } from '../store/reducers/estimateReducer';

export default function useEstimate() {
  const [driver, setDriver] = useState<IRideShareDriver | null>(null);
  const [initialValues, setInitialValues] = useState<IEstimateValues>(estimateModel.initialValues);
  const [labourTotal, setLabourTotal] = useState<number>(0);
  const [partTotal, setPartTotal] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [success, setSuccess] = useState<CustomHookMessage>();
  const [error, setError] = useState<CustomHookMessage>();
  const [estimates, setEstimates] = useState<IEstimate[]>([]);
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [showView, setShowView] = useState<boolean>(false);
  const [estimateId, setEstimateId] = useState<number>();
  const [partnerId, setPartnerId] = useState<number>();

  const estimateReducer = useAppSelector(state => state.estimateReducer);
  const dispatch = useAppDispatch();

  const params = useParams();

  useEffect(() => {
    const auth = jwt.decode(cookie.get(settings.auth.admin)) as CustomJwtPayload;

    if (params.id) {
      setPartnerId(+params.id);
    }

    if (auth.partnerId) {
      setPartnerId(auth.partnerId);
    }
  }, [params]);

  useEffect(() => {
    if (estimateReducer.createEstimateStatus === 'completed') {
      setSuccess({ message: estimateReducer.createEstimateSuccess });
    }
  }, [estimateReducer.createEstimateStatus, estimateReducer.createEstimateSuccess]);

  useEffect(() => {
    if (estimateReducer.createEstimateStatus === 'failed') {
      if (estimateReducer.createEstimateError) setError({ message: estimateReducer.createEstimateError });
    }
  }, [estimateReducer.createEstimateError, estimateReducer.createEstimateStatus]);

  useEffect(() => {
    if (estimateReducer.getEstimatesStatus === 'idle') {
      dispatch(getEstimatesAction());
    }
  }, [dispatch, estimateReducer.getEstimatesStatus]);

  useEffect(() => {
    if (estimateReducer.getEstimatesStatus === 'completed') {
      setEstimates(estimateReducer.estimates);
    }
  }, [estimateReducer.estimates, estimateReducer.getEstimatesStatus]);

  useEffect(() => {
    if (estimateReducer.getEstimatesStatus === 'failed') {
      if (estimateReducer.getEstimatesError) setError({ message: estimateReducer.getEstimatesError });
    }
  }, [estimateReducer.getEstimatesError, estimateReducer.getEstimatesStatus]);

  useEffect(() => {
    return () => {
      dispatch(clearCreateEstimateStatus());
      dispatch(clearGetEstimateStatus());
    };
  }, [dispatch]);

  const handleCreateEstimate = (values: IEstimateValues, options?: GenericObjectType) => {
    if (+values.depositAmount <= grandTotal) {
      const data = {
        id: partnerId,
        parts: values.parts,
        labours: values.labours,
        tax: values.tax,
        addressType: values.addressType,
        address: values.address,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        depositAmount: values.depositAmount,
        jobDurationValue: values.jobDuration.count,
        jobDurationUnit: values.jobDuration.interval,
        vin: values.vin,
        make: values.make,
        model: values.model,
        plateNumber: values.plateNumber,
        modelYear: values.modelYear,
        mileageValue: values.mileage.count,
        mileageUnit: values.mileage.unit,
        partsTotal: partTotal,
        laboursTotal: labourTotal,
        grandTotal,
        url: options?.url,
      };

      dispatch(createEstimateAction(data));
    } else
      setError({ message: `Deposit ${values.depositAmount} must be less than or equal to Grand Total ${grandTotal}` });
  };

  const onEdit = (estimateId: number) => {
    const estimate = estimates.find(estimate => estimate.id === estimateId);

    if (estimate) {
      const driver = estimate.rideShareDriver;
      const customer = estimate.customer;
      const vehicle = estimate.vehicle;

      const parts = estimate.parts as unknown as IPart[];
      const labours = estimate.labours as unknown as ILabour[];

      setInitialValues(prevState => ({
        ...prevState,
        firstName: driver ? driver.firstName : customer.firstName,
        lastName: driver ? driver.lastName : customer.lastName,
        phone: driver ? driver.phone : customer.phone,
        make: vehicle.make,
        model: vehicle.model,
        plateNumber: vehicle.plateNumber,
        vin: vehicle.vin ? vehicle.vin : '',
        modelYear: vehicle.modelYear,
        address: estimate.address ? estimate.address : '',
        addressType: estimate.addressType ? estimate.addressType : '',
        jobDuration: { count: `${estimate.jobDurationValue}`, interval: estimate.jobDurationUnit },
        depositAmount: `${estimate.depositAmount}`,
        tax: `${estimate.tax}`,
        mileage: {
          count: vehicle.mileageValue ? vehicle.mileageValue : '',
          unit: vehicle.mileageUnit ? vehicle.mileageUnit : '',
        },
        parts,
        labours,
      }));

      setGrandTotal(estimate.grandTotal);
      setPartTotal(estimate.partsTotal);
      setLabourTotal(estimate.laboursTotal);
      setEstimateId(estimateId);
      setShowEdit(true);
    } else setError({ message: 'An Error Occurred. Please try again or contact support' });
  };

  const onView = (estimateId: number) => {
    setEstimateId(estimateId);
    setShowView(true);
  };

  return {
    setLabourTotal,
    setPartTotal,
    setGrandTotal,
    success,
    setSuccess,
    error,
    setError,
    estimates,
    setEstimates,
    showCreate,
    setShowCreate,
    showEdit,
    setShowEdit,
    driver,
    setDriver,
    initialValues,
    setInitialValues,
    estimateId,
    partTotal,
    labourTotal,
    grandTotal,
    showView,
    setShowView,
    handleCreateEstimate,
    onEdit,
    onView,
  };
}
