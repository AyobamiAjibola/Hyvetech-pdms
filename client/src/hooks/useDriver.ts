import { useEffect, useState } from "react";
import { GridSortItem } from "@mui/x-data-grid";
import useAppSelector from "./useAppSelector";
import useAppDispatch from "./useAppDispatch";
import { getDriversAction } from "../store/actions/rideShareActions";
import { clearGetDriverStatus } from "../store/reducers/rideShareReducer";

export default function useDriver() {
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<readonly any[]>([]);
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
      setLoading(true);
    }
  }, [rideShareReducer.getDriversStatus]);

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
  };
}
