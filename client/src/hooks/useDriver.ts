import { useEffect, useState } from "react";
import { GridSortItem } from "@mui/x-data-grid";
import useAppSelector from "./useAppSelector";
import useAppDispatch from "./useAppDispatch";
import { deleteDriverAction, getDriversAction } from "../store/actions/rideShareActions";
import {
  clearDeleteDriverStatus,
  clearGetDriversStatus,
  clearGetDriverStatus,
} from "../store/reducers/rideShareReducer";
import { IRideShareDriver } from "@app-models";
import { CustomHookMessage } from "@app-types";

export default function useDriver() {
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<readonly any[]>([]);
  const [driverId, setDriverId] = useState<number>();
  const [error, setError] = useState<CustomHookMessage>();
  const [success, setSuccess] = useState<CustomHookMessage>();
  const [sortModel, setSortModel] = useState<GridSortItem[]>([
    {
      field: "id",
      sort: "asc",
    },
  ]);

  const rideShareReducer = useAppSelector((state) => state.rideShareReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearGetDriverStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    if (rideShareReducer.getDriversStatus === "idle") {
      dispatch(getDriversAction());
    }
  }, [rideShareReducer.getDriversStatus, dispatch]);

  useEffect(() => {
    if (rideShareReducer.getDriversStatus === "loading") {
      setLoading(true);
    }
  }, [rideShareReducer.getDriversStatus, dispatch]);

  useEffect(() => {
    if (rideShareReducer.getDriversStatus === "completed") {
      setLoading(false);
      setRows(rideShareReducer.drivers);
    }
  }, [rideShareReducer.drivers, rideShareReducer.getDriversStatus]);

  useEffect(() => {
    if (rideShareReducer.getDriversStatus === "failed") {
      setLoading(false);
      if (rideShareReducer.getDriversError) setError({ message: rideShareReducer.getDriversError });
    }
  }, [rideShareReducer.getDriversError, rideShareReducer.getDriversStatus]);

  useEffect(() => {
    if (rideShareReducer.deleteDriverStatus === "completed") {
      setLoading(false);
      setSuccess({ message: rideShareReducer.deleteDriverSuccess });
    }
  }, [rideShareReducer.drivers, rideShareReducer.deleteDriverStatus, rideShareReducer.deleteDriverSuccess]);

  useEffect(() => {
    if (rideShareReducer.deleteDriverStatus === "failed") {
      setLoading(false);
      if (rideShareReducer.deleteDriverError) setError({ message: rideShareReducer.deleteDriverError });
    }
  }, [rideShareReducer.deleteDriverError, rideShareReducer.deleteDriverStatus]);

  useEffect(() => {
    return () => {
      dispatch(clearGetDriverStatus());
      dispatch(clearGetDriversStatus());
      dispatch(clearDeleteDriverStatus());
    };
  }, [dispatch]);

  const onDelete = (driver: IRideShareDriver) => {
    setDriverId(driver.id);
    setShowDelete(true);
  };

  const handleDelete = () => {
    if (driverId) {
      dispatch(deleteDriverAction(driverId));
    }

    setShowDelete(false);
  };

  return {
    rows,
    sortModel,
    setSortModel,
    loading,
    showDelete,
    setShowDelete,
    error,
    setError,
    success,
    setSuccess,
    handleDelete,
    onDelete,
  };
}
