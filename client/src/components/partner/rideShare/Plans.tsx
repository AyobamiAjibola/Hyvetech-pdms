import React, { useEffect, useState } from "react";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { Delete, Visibility } from "@mui/icons-material";
import { IPlan } from "@app-models";
import { Button, DialogActions, DialogContentText, Grid, TableBody, TableCell, TableRow } from "@mui/material";
import AppDataGrid from "../../tables/AppDataGrid";
import useAppSelector from "../../../hooks/useAppSelector";
import AppModal from "../../modal/AppModal";
import { Formik, FormikHelpers } from "formik";
import planModel, { IPlanModel } from "../../forms/models/planModel";
import AddPlanForm from "../../forms/partner/AddPlanForm";
import { addPlanAction, deletePlanAction } from "../../../store/actions/partnerActions";
import { useParams } from "react-router-dom";
import useAppDispatch from "../../../hooks/useAppDispatch";
import capitalize from "capitalize";
import { MESSAGES } from "../../../config/constants";
import moment from "moment";
import { CustomHookMessage } from "@app-types";
import AppAlert from "../../alerts/AppAlert";
import { clearDeletePlanStatus } from "../../../store/reducers/partnerReducer";

function Plans() {
  const [openAddPlan, setOpenAddPlan] = useState<boolean>(false);
  const [openViewPlan, setOpenViewPlan] = useState<boolean>(false);
  const [openDeletePlan, setOpenDeletePlan] = useState<boolean>(false);
  const [plan, setPlan] = useState<IPlan>();
  const [success, setSuccess] = useState<CustomHookMessage>();
  const [error, setError] = useState<CustomHookMessage>();

  const params = useParams();

  const partnerReducer = useAppSelector((state) => state.partnerReducer);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (partnerReducer.addPlanStatus === "completed") {
      setOpenAddPlan(false);
    }
  }, [partnerReducer.addPlanStatus]);

  useEffect(() => {
    if (partnerReducer.deletePlanStatus === "completed") {
      setSuccess({ message: partnerReducer.deletePlanSuccess });
    }
  }, [partnerReducer.deletePlanStatus, partnerReducer.deletePlanSuccess]);

  useEffect(() => {
    if (partnerReducer.deletePlanStatus === "failed") {
      if (partnerReducer.deletePlanError) {
        setError({ message: partnerReducer.deletePlanError });
      }
    }
  }, [partnerReducer.deletePlanError, partnerReducer.deletePlanStatus]);

  useEffect(() => {
    return () => {
      dispatch(clearDeletePlanStatus());
    };
  }, [dispatch]);

  const handleOpenAddPlan = () => {
    setOpenAddPlan(true);
  };

  const handleCloseOpenAddPlan = () => {
    setOpenAddPlan(false);
  };

  const handleAddPlan = (values: IPlanModel, formikHelper: FormikHelpers<IPlanModel>) => {
    const data = {
      label: values.label,
      minVehicles: +values.minVehicles,
      maxVehicles: +values.maxVehicles,
      validity: `${values.validity} months`,
      mobile: +values.mobile,
      driveIn: +values.driveIn,
      inspections: parseInt(values.driveIn) + parseInt(values.mobile),
      programme: values.programme,
      serviceMode: values.serviceMode,
    };

    if (undefined === params.id) throw Error("Partner ID is required");

    dispatch(addPlanAction({ plan: data, partnerId: params.id }));

    formikHelper.resetForm();
  };

  const handleView = (plan: IPlan) => {
    setOpenViewPlan(true);
    setPlan(plan);
  };

  const handleDelete = (plan: IPlan) => {
    setOpenDeletePlan(true);
    setPlan(plan);
  };

  const handleConfirmDelete = () => {
    if (plan) {
      dispatch(deletePlanAction(plan.id));
      setOpenDeletePlan(false);
    }
  };

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Grid container justifyContent="space-between" mb={1}>
          <Grid item />
          <Grid item>
            <Button onClick={handleOpenAddPlan} size="small" variant="contained" color="success">
              Add
            </Button>
          </Grid>
        </Grid>
        <AppDataGrid
          loading={partnerReducer.getPlansStatus === "loading"}
          showToolbar
          rows={partnerReducer.plans}
          columns={columns({ onView: handleView, onDelete: handleDelete })}
        />
      </Grid>
      <AppModal
        fullWidth
        size="md"
        show={openAddPlan}
        Content={
          <Formik validationSchema={planModel.schema} initialValues={planModel.initialValues} onSubmit={handleAddPlan}>
            <AddPlanForm />
          </Formik>
        }
        onClose={handleCloseOpenAddPlan}
      />
      <AppModal
        show={openViewPlan}
        Content={
          plan ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={4} component="th" scope="row">
                  Plan Name
                </TableCell>
                <TableCell colSpan={4} align="right">
                  {capitalize.words(plan.label).replaceAll("_", " ")}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4} component="th" scope="row">
                  Validity
                </TableCell>
                <TableCell colSpan={4} align="right">
                  {plan.validity}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4} component="th" scope="row">
                  Inspections
                </TableCell>
                <TableCell colSpan={4} align="right">
                  {plan.inspections}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4} component="th" scope="row">
                  Min/Max Vehicles
                </TableCell>
                <TableCell colSpan={4} align="right">
                  {plan.minVehicles}/{plan.maxVehicles}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4} component="th" scope="row">
                  Total Drive-in
                </TableCell>
                <TableCell colSpan={4} align="right">
                  {plan.driveIn}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4} component="th" scope="row">
                  Total Mobile
                </TableCell>
                <TableCell colSpan={4} align="right">
                  {plan.mobile}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4} component="th" scope="row">
                  Date Added
                </TableCell>
                <TableCell colSpan={4} align="right">
                  {moment(plan.createdAt).format("LLL")}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4} component="th" scope="row">
                  Date Modified
                </TableCell>
                <TableCell colSpan={4} align="right">
                  {moment(plan.updatedAt).format("LLL")}
                </TableCell>
              </TableRow>
            </TableBody>
          ) : null
        }
        onClose={() => setOpenViewPlan(false)}
      />
      <AppModal
        fullWidth
        show={openDeletePlan}
        Content={<DialogContentText>{MESSAGES.cancelText}</DialogContentText>}
        ActionComponent={
          <DialogActions>
            <Button onClick={() => setOpenDeletePlan(false)}>Disagree</Button>
            <Button onClick={handleConfirmDelete}>Agree</Button>
          </DialogActions>
        }
        onClose={() => setOpenDeletePlan(false)}
      />
      <AppAlert
        alertType="success"
        show={undefined !== success}
        message={success?.message}
        onClose={() => setSuccess(undefined)}
      />
      <AppAlert
        alertType="error"
        show={undefined !== error}
        message={error?.message}
        onClose={() => setError(undefined)}
      />
    </React.Fragment>
  );
}

const columns = (options?: any) =>
  [
    {
      field: "id",
      headerName: "ID",
      headerAlign: "center",
      align: "center",
      sortable: true,
      type: "number",
    },
    {
      field: "label",
      headerName: "Name",
      headerAlign: "left",
      width: 300,
      align: "left",
      type: "string",
      sortable: true,
      valueFormatter: (params) => {
        return params.value ? params.value.replaceAll("_", " ") : "";
      },
    },
    {
      field: "validity",
      headerName: "Interval",
      headerAlign: "center",
      width: 150,
      align: "center",
      type: "string",
      sortable: true,
    },
    {
      field: "serviceMode",
      headerName: "Service Mode",
      headerAlign: "center",
      width: 150,
      align: "center",
      type: "string",
      sortable: true,
    },
    {
      field: "maxVehicles",
      headerName: "Maximum Vehicles",
      headerAlign: "center",
      width: 170,
      align: "center",
      type: "string",
      sortable: true,
    },
    {
      field: "minVehicles",
      headerName: "Minimum Vehicles",
      headerAlign: "center",
      width: 170,
      align: "center",
      type: "string",
      sortable: true,
    },
    {
      field: "inspections",
      headerName: "Inspections",
      headerAlign: "center",
      width: 150,
      align: "center",
      type: "string",
      sortable: true,
    },
    {
      field: "actions",
      type: "actions",
      align: "center",
      headerAlign: "center",
      getActions: (params: any) => [
        <GridActionsCellItem
          key={0}
          icon={<Visibility sx={{ color: "dodgerblue" }} />}
          onClick={() => options.onView(params.row)}
          label="View"
          showInMenu={false}
        />,
        <GridActionsCellItem
          key={1}
          icon={<Delete sx={{ color: "red" }} />}
          onClick={() => options.onDelete(params.row)}
          label="Delete"
          showInMenu={false}
        />,
      ],
    },
  ] as GridColDef<IPlan>[];

export default Plans;
