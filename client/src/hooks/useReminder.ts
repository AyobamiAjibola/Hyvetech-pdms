// noinspection JSUnfilteredForInLoop
import { useCallback, useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import useAppSelector from './useAppSelector';
import useAppDispatch from './useAppDispatch';
import { CustomHookMessage } from '@app-types';
import { useParams } from 'react-router-dom';
import settings from '../config/settings';
import { CustomJwtPayload } from '@app-interfaces';
import reminderModel, { IReminderTypeValues, IReminderValues } from '../components/forms/models/reminderModel';
import { IReminderType, IServiceReminder } from '@app-models';
import { clearCreateReminderStatus, clearCreateReminderTypeStatus, clearUpdateReminderStatus, clearUpdateReminderTypeStatus } from '../store/reducers/serviceReminderReducer';
import { createReminderAction, createReminderTypeAction, deleteReminderAction, getReminderAction, getReminderTypesAction, updateReminderAction, updateReminderTypeAction } from '../store/actions/serviceReminderActions';
import { getCustomerAction } from '../store/actions/customerActions';

export default function useReminder() {
    const [initialValues, setInitialValues] = useState<IReminderValues>(reminderModel.initialValues);
    const [success, setSuccess] = useState<CustomHookMessage>();
    const [error, setError] = useState<CustomHookMessage>();
    const [reminders, setReminders] = useState<IServiceReminder[]>([]);
    const [showCreate, setShowCreate] = useState<boolean>(false);
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [showView, setShowView] = useState<boolean>(false);
    const [showDelete, setShowDelete] = useState<boolean>(false);
    const [reminderId, setReminderId] = useState<number>();
    const [partnerId, setPartnerId] = useState<number>();
    const [save, setSave] = useState<boolean>(false);

    const [reminderTypeInitialValues, setReminderTypeInitialValues] = useState<IReminderTypeValues>(reminderModel.initialValuesReminderType);
    const [reminderTypes, setReminderTypes] = useState<IReminderType[]>([]);
    const [reminderTypeId, setReminderTypeId] = useState<number>();

    const reminderReducer = useAppSelector(state => state.serviceReminderReducer);
    const dispatch = useAppDispatch();

    const params = useParams();

    const handleReset = useCallback(() => {
        dispatch(clearCreateReminderTypeStatus());
        dispatch(clearUpdateReminderTypeStatus());
        dispatch(clearCreateReminderStatus());
        dispatch(clearUpdateReminderStatus())
        setSave(false);
    }, [dispatch]);

    useEffect(() => {
        const auth = jwt.decode(sessionStorage.getItem(settings.auth.admin) as string) as unknown as CustomJwtPayload;
        if (params.id) {
          setPartnerId(+params.id);
        }
        if (auth?.partnerId) {
          setPartnerId(auth.partnerId);
        }
    }, [params]);

    useEffect(() => {
        if (reminderReducer.createReminderTypeStatus === 'failed') {
            if (reminderReducer.createReminderTypeError) setError({ message: reminderReducer.createReminderTypeError });
            handleReset();
    }
    }, [reminderReducer.createReminderTypeError, reminderReducer.createReminderTypeStatus, handleReset]);

    useEffect(() => {
        if (reminderReducer.createReminderTypeStatus === 'completed') {
            setSuccess({ message: reminderReducer.createReminderTypeSuccess });
            handleReset();
            dispatch(getReminderTypesAction())
        }
    }, [reminderReducer.createReminderTypeStatus, reminderReducer.createReminderTypeSuccess, handleReset]);

    useEffect(() => {
        if (reminderReducer.updateReminderTypeStatus === 'failed') {
            if (reminderReducer.updateReminderTypeError) setError({ message: reminderReducer.updateReminderTypeError });
            handleReset();
        }
    }, [reminderReducer.updateReminderTypeError, reminderReducer.updateReminderTypeStatus, handleReset]);

    useEffect(() => {
        if (reminderReducer.updateReminderTypeStatus === 'completed') {
            setSuccess({ message: reminderReducer.updateReminderTypeSuccess });
            handleReset();
            dispatch(getReminderTypesAction());
        }
    }, [dispatch, reminderReducer.updateReminderTypeStatus, reminderReducer.updateReminderSuccess, handleReset]);

    useEffect(() => {
        if (reminderReducer.getReminderTypesStatus === 'idle') {
            dispatch(getReminderTypesAction())
        }
    }, [dispatch, reminderReducer.getReminderTypesStatus]);

    useEffect(() => {
        if (reminderReducer.getReminderTypesStatus === 'failed') {
            if (reminderReducer.getReminderTypesError) setError({ message: reminderReducer.getReminderTypesError });
        }
    }, [reminderReducer.getReminderTypesError, reminderReducer.getReminderTypesStatus]);

    useEffect(() => {
        if (reminderReducer.getReminderTypesStatus === 'completed') {
            setReminderTypes(reminderReducer.reminderTypes);
        }
    }, [reminderReducer.reminderTypes, reminderReducer.getReminderTypesStatus]);

    useEffect(() => {
        if (reminderReducer.getRemindersStatus === 'idle') {
            dispatch(getReminderAction())
        }
    }, [dispatch, reminderReducer.getRemindersStatus]);

    useEffect(() => {
    if (reminderReducer.getRemindersStatus === 'failed') {
        if (reminderReducer.getRemindersError) setError({ message: reminderReducer.getRemindersError });
    }
    }, [reminderReducer.getRemindersError, reminderReducer.getRemindersStatus]);

    useEffect(() => {
        if (reminderReducer.getRemindersStatus === 'completed') {
            setReminders(reminderReducer.reminders);
        }
    }, [reminderReducer.reminders, reminderReducer.getRemindersStatus]);

    useEffect(() => {
        if (reminderReducer.createReminderStatus === 'failed') {
            if (reminderReducer.createReminderError) setError({ message: reminderReducer.createReminderError });
            handleReset();
    }
    }, [reminderReducer.createReminderError, reminderReducer.createReminderStatus, handleReset]);

    useEffect(() => {
        if (reminderReducer.createReminderStatus === 'completed') {
            setSuccess({ message: reminderReducer.createReminderSuccess });
            handleReset();
        }
    }, [reminderReducer.createReminderStatus, reminderReducer.createReminderSuccess, handleReset]);

    useEffect(() => {
        if (reminderReducer.updateReminderStatus === 'failed') {
            if (reminderReducer.updateReminderError) setError({ message: reminderReducer.updateReminderError });
            handleReset();
        }
    }, [reminderReducer.updateReminderError, reminderReducer.updateReminderStatus, handleReset]);

    useEffect(() => {
        if (reminderReducer.updateReminderStatus === 'completed') {
            setSuccess({ message: reminderReducer.updateReminderSuccess });
            handleReset();
        }
    }, [dispatch, reminderReducer.updateReminderStatus, reminderReducer.updateReminderSuccess, handleReset]);

    useEffect(() => {
        if (reminderReducer.deleteReminderStatus === 'failed') {
            setError({ message: reminderReducer.deleteReminderError });
            handleReset();
        }
    }, [reminderReducer.deleteReminderError, reminderReducer.deleteReminderStatus, handleReset]);

    useEffect(() => {
        if (reminderReducer.deleteReminderStatus === 'completed') {
            setSuccess({ message: reminderReducer.deleteReminderSuccess });
            handleReset();
            dispatch(getReminderAction());
        }
    }, [dispatch, reminderReducer.deleteReminderStatus, reminderReducer.deleteReminderSuccess, handleReset]);

    const handleCreateReminderType = (values: IReminderTypeValues) => {
        console.log(values)
        const data = {
            id: partnerId,
            name: values.name,
        };

            dispatch(createReminderTypeAction(data));
    };

    const handleUpdateReminderType = (values: IReminderTypeValues) => {

        const data = {
            id: reminderTypeId,
            name: values.name
        };

        void dispatch(updateReminderTypeAction(data))
    };

    const onEditReminderType = useCallback(
        (reminderTypeId: number) => {
            void dispatch(getReminderTypesAction());

            const reminderType = reminderTypes.find(reminderType => reminderType.id === reminderTypeId);

            if (reminderType) {
                setReminderTypeInitialValues(prevState => ({
                    ...prevState,
                    name: reminderType.name
                }));

                setReminderTypeId(reminderTypeId);
                setShowEdit(true);
            } else setError({ message: 'An Error Occurred. Please try again or contact support' });
        },
        [dispatch, reminderTypes]
    );

    const handleCreateReminder = (values: IReminderValues) => {
        const serviceStatus = values.serviceStatus === 'done' && 'active'

        const data = {
            id: partnerId,
            reminderType: values.reminderType,
            email: values.email,
            vin: values.vin,
            lastServiceDate: values.lastServiceDate,
            serviceInterval: values.serviceInterval?.toString(),
            serviceIntervalUnit: values.serviceIntervalUnit,
            note: values.note,
            recurring: values.recurring,
            nextServiceDate: values.nextServiceDate,
            reminderStatus: values.reminderStatus,
            serviceStatus: serviceStatus,
            lastServiceMileage: values.lastServiceMileage?.toString(),
            lastServiceMileageUnit: values.lastServiceMileageUnit,
            nextServiceMileage: values.nextServiceMileage?.toString(),
            nextServiceMileageUnit: values.nextServiceMileageUnit
        };

        dispatch(createReminderAction(data));
    };

    const handleUpdateReminder = (values: IReminderValues) => {
        const serviceStatus = values.serviceStatus === 'done' && 'active';

        const data = {
            id: reminderId,
            reminderType: values.reminderType,
            lastServiceDate: values.lastServiceDate,
            serviceInterval: values.serviceInterval?.toString(),
            serviceIntervalUnit: values.serviceIntervalUnit,
            note: values.note,
            recurring: values.recurring,
            serviceStatus: serviceStatus,
            lastServiceMileage: values.lastServiceMileage?.toString(),
            lastServiceMileageUnit: values.lastServiceMileageUnit,
            nextServiceMileage: values.nextServiceMileage?.toString(),
            nextServiceMileageUnit: values.nextServiceMileageUnit
        };

        void dispatch(updateReminderAction(data))
    };

    const onEdit = useCallback(
        (reminderId: number) => {
            void dispatch(getReminderAction());

            const reminder = reminders.find(reminder => reminder.id === reminderId);

            if (reminder) {

                dispatch(getCustomerAction(reminder.customer?.id));

                setInitialValues(prevState => ({
                    ...prevState,
                    reminderType: reminder.reminderType,
                    email: reminder.customer.email,
                    vin: reminder.vehicle.vin,
                    make: reminder.vehicle.make,
                    model: reminder.vehicle.model,
                    modelYear: reminder.vehicle.modelYear,
                    lastServiceDate: reminder.lastServiceDate,
                    serviceInterval: reminder.serviceInterval,
                    serviceIntervalUnit: reminder.serviceIntervalUnit,
                    note: reminder.note,
                    recurring: reminder.recurring,
                    reminderStatus: reminder.reminderStatus,
                    lastServiceMileage: reminder.lastServiceMileage,
                    lastServiceMileageUnit: reminder.lastServiceMileageUnit,
                    nextServiceMileage: reminder.nextServiceMileage,
                    nextServiceMileageUnit: reminder.nextServiceMileageUnit
                }));

                setReminderId(reminderId);
                setShowEdit(true);
            } else setError({ message: 'An Error Occurred. Please try again or contact support' });
        },
        [dispatch, reminders]
    );

    const onDelete = useCallback((id: number) => {
        setReminderId(id);
        setShowDelete(true);
    }, []);

    const handleDelete = useCallback(() => {
        if(reminderId) void dispatch(deleteReminderAction(reminderId));
        setShowDelete(false);
    }, [dispatch, reminderId]);

    const onView = (reminderId: number) => {
        setReminderId(reminderId);
        setShowView(true);
    };

    return {
        reminders, setReminders,
        onEdit,
        onDelete,
        onView,
        success,
        setSuccess,
        error,
        setError,
        showCreate,
        setShowCreate,
        showEdit,
        setShowEdit,
        initialValues,
        setInitialValues,
        showView,
        setShowView,
        save,
        setSave,
        showDelete,
        setShowDelete,
        handleCreateReminder,
        handleDelete,
        handleUpdateReminder,
        handleCreateReminderType,
        handleUpdateReminderType,
        onEditReminderType,
        reminderTypeInitialValues,
        setReminderTypeInitialValues,
        reminderTypes, setReminderTypes
    }
}