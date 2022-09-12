import { useEffect, useState } from "react";
import { GridSortItem } from "@mui/x-data-grid";
import useAppSelector from "./useAppSelector";
import useAppDispatch from "./useAppDispatch";
import { getCustomersAction } from "../store/actions/customerActions";
import { clearGetCustomersStatus } from "../store/reducers/customerReducer";

export default function useCustomer() {
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<readonly any[]>([]);
  const [sortModel, setSortModel] = useState<GridSortItem[]>([
    {
      field: "id",
      sort: "asc",
    },
  ]);

  const customerReducer = useAppSelector((state) => state.customerReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearGetCustomersStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    if (customerReducer.getCustomersStatus === "idle") {
      dispatch(getCustomersAction());
    }
  }, [customerReducer.getCustomersStatus, dispatch]);

  useEffect(() => {
    if (customerReducer.getCustomersStatus === "loading") {
      setLoading(true);
    }
  }, [customerReducer.getCustomersStatus, dispatch]);

  useEffect(() => {
    if (customerReducer.getCustomersStatus === "completed") {
      setLoading(false);
      setRows(customerReducer.customers);
    }
  }, [customerReducer.customers, customerReducer.getCustomersStatus]);

  useEffect(() => {
    if (customerReducer.getCustomersStatus === "failed") {
      setLoading(true);
    }
  }, [customerReducer.getCustomersStatus]);

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
