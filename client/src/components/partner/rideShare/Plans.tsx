import React, { useEffect, useState } from "react";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { Delete, Visibility } from "@mui/icons-material";
import { IPlan } from "@app-models";
import { Button, Grid } from "@mui/material";
import AppDataGrid from "../../tables/AppDataGrid";
import useAppSelector from "../../../hooks/useAppSelector";
import AppModal from "../../modal/AppModal";
import { Formik, FormikHelpers } from "formik";
import planModel, { IPlanModel } from "../../forms/models/planModel";
import AddPlanForm from "../../forms/partner/AddPlanForm";
import { addPlanAction } from "../../../store/actions/partnerActions";
import { useParams } from "react-router-dom";
import useAppDispatch from "../../../hooks/useAppDispatch";

function Plans() {
  const [openAddPlan, setOpenAddPlan] = useState<boolean>(false);

  const params = useParams();

  const partnerReducer = useAppSelector((state) => state.partnerReducer);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (partnerReducer.addPlanStatus === "completed") {
      setOpenAddPlan(false);
    }
  }, [partnerReducer.addPlanStatus]);

  const handleOpenAddPlan = () => {
    setOpenAddPlan(true);
  };

  const handleCloseOpenAddPlan = () => {
    setOpenAddPlan(false);
  };

  const handleAddPlan = (
    values: IPlanModel,
    formikHelper: FormikHelpers<IPlanModel>
  ) => {
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

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Grid container justifyContent="space-between" mb={1}>
          <Grid item />
          <Grid item>
            <Button
              onClick={handleOpenAddPlan}
              size="small"
              variant="contained"
              color="success"
            >
              Add
            </Button>
          </Grid>
        </Grid>
        <AppDataGrid
          loading={partnerReducer.getPlansStatus === "loading"}
          showToolbar
          rows={partnerReducer.plans}
          columns={columns()}
        />
      </Grid>
      <AppModal
        fullWidth
        size="md"
        show={openAddPlan}
        Content={
          <Formik
            validationSchema={planModel.schema}
            initialValues={planModel.initialValues}
            onSubmit={handleAddPlan}
          >
            <AddPlanForm />
          </Formik>
        }
        onClose={handleCloseOpenAddPlan}
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
