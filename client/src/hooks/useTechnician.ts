import { useEffect, useState } from "react";
import { CustomHookMessage } from "@app-types";
import useAppSelector from "./useAppSelector";
import useAppDispatch from "./useAppDispatch";
import {
  createTechnicianAction,
  deleteTechnicianAction,
  getPartnerTechniciansAction,
  getTechniciansAction,
  updateTechnicianAction,
} from "../store/actions/technicianActions";
import { ITechnicianValues } from "../components/forms/models/technicianModel";
import settings from "../config/settings";
import useAdmin from "./useAdmin";
import { useParams } from "react-router-dom";
import { IJob, ITechnician } from "@app-models";
import { MESSAGES } from "../config/constants";

export default function useTechnician() {
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [showView, setShowView] = useState<boolean>(false);
  const [showViewJob, setShowViewJob] = useState<boolean>(false);
  const [error, setError] = useState<CustomHookMessage>();
  const [success, setSuccess] = useState<CustomHookMessage>();
  const [detail, setDetail] = useState<ITechnician | null>(null);
  const [job, setJob] = useState<IJob | null>(null);
  const [techId, setTechId] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<ITechnicianValues>({
    active: false,
    confirmPassword: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    phone: "",
  });

  const admin = useAdmin();
  const params = useParams();

  const technicianReducer = useAppSelector((state) => state.technicianReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (technicianReducer.getTechniciansStatus === "idle") {
      if (params.id) {
        dispatch(getPartnerTechniciansAction(+params.id));
      } else dispatch(getTechniciansAction());
    }
  }, [dispatch, params.id, technicianReducer.getTechniciansStatus]);

  useEffect(() => {
    if (technicianReducer.createTechnicianStatus === "loading") {
      setLoading(technicianReducer.createTechnicianStatus === "loading");
    }
  }, [dispatch, technicianReducer.createTechnicianStatus]);

  useEffect(() => {
    if (technicianReducer.createTechnicianStatus === "completed") {
      setShowCreate(false);
      setLoading(false);
      setSuccess({ message: technicianReducer.createTechnicianSuccess });
      dispatch(getTechniciansAction());
    }
  }, [
    dispatch,
    technicianReducer.createTechnicianStatus,
    technicianReducer.createTechnicianSuccess,
  ]);

  useEffect(() => {
    if (technicianReducer.createTechnicianStatus === "failed") {
      setShowCreate(false);
      setLoading(false);
      if (technicianReducer.createTechnicianError) {
        setError({ message: technicianReducer.createTechnicianError });
      }
    }
  }, [
    dispatch,
    technicianReducer.createTechnicianError,
    technicianReducer.createTechnicianStatus,
  ]);

  useEffect(() => {
    if (technicianReducer.updateTechnicianStatus === "loading") {
      setLoading(technicianReducer.updateTechnicianStatus === "loading");
    }
  }, [dispatch, technicianReducer.updateTechnicianStatus]);

  useEffect(() => {
    if (technicianReducer.updateTechnicianStatus === "completed") {
      setShowEdit(false);
      setLoading(false);
      setSuccess({ message: technicianReducer.updateTechnicianSuccess });
      dispatch(getTechniciansAction());
    }
  }, [
    dispatch,
    technicianReducer.updateTechnicianStatus,
    technicianReducer.updateTechnicianSuccess,
  ]);

  useEffect(() => {
    if (technicianReducer.updateTechnicianStatus === "failed") {
      setShowEdit(false);
      setLoading(false);
      if (technicianReducer.updateTechnicianError) {
        setError({ message: technicianReducer.updateTechnicianError });
      }
    }
  }, [
    dispatch,
    technicianReducer.updateTechnicianError,
    technicianReducer.updateTechnicianStatus,
  ]);

  useEffect(() => {
    if (technicianReducer.deleteTechnicianStatus === "loading") {
      setLoading(technicianReducer.deleteTechnicianStatus === "loading");
    }
  }, [dispatch, technicianReducer.deleteTechnicianStatus]);

  useEffect(() => {
    if (technicianReducer.deleteTechnicianStatus === "completed") {
      setShowDelete(false);
      setLoading(false);
      setSuccess({ message: technicianReducer.deleteTechnicianSuccess });
      dispatch(getTechniciansAction());
    }
  }, [
    dispatch,
    technicianReducer.deleteTechnicianStatus,
    technicianReducer.deleteTechnicianSuccess,
  ]);

  useEffect(() => {
    if (technicianReducer.deleteTechnicianStatus === "failed") {
      setShowDelete(false);
      setLoading(false);
      if (technicianReducer.deleteTechnicianError) {
        setError({ message: technicianReducer.deleteTechnicianError });
      }
    }
  }, [
    dispatch,
    technicianReducer.deleteTechnicianError,
    technicianReducer.deleteTechnicianStatus,
  ]);

  const handleCreate = (values: ITechnicianValues) => {
    const data: { [p: string]: any } = {
      ...values,
      role: settings.roles[5],
    };

    if (admin.isTechAdmin && admin.user) {
      data.partnerId = `${admin.user.partner.id}`;
      dispatch(createTechnicianAction(data));
      return;
    }

    if (params.id) {
      data.partnerId = params.id as string;
      dispatch(createTechnicianAction(data));
      return;
    }

    throw new Error("An error occurred. Contact support");
  };

  const handleDelete = () => {
    if (detail) {
      dispatch(deleteTechnicianAction(detail.id));
    } else setError({ message: MESSAGES.internalError });
    setShowDelete(false);
  };

  const handleView = (tech: ITechnician) => {
    setDetail(tech);
    setShowView(true);
  };

  const handleEdit = (values: ITechnicianValues) => {
    const data = {
      ...values,
      id: `${techId}`,
    };

    dispatch(updateTechnicianAction(data));
  };

  return {
    showCreate,
    setShowCreate,
    showEdit,
    setShowEdit,
    showDelete,
    setShowDelete,
    error,
    setError,
    success,
    setSuccess,
    showView,
    setShowView,
    detail,
    setDetail,
    showViewJob,
    setShowViewJob,
    job,
    setJob,
    initialValues,
    setInitialValues,
    techId,
    setTechId,
    loading,
    handleDelete,
    handleView,
    handleEdit,
    handleCreate,
  };
}
