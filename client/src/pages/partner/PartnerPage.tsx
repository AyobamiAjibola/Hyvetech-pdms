import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Formik, FormikHelpers } from "formik";
import { Button, Divider, Grid, Stack } from "@mui/material";
import AppDataGrid from "../../components/tables/AppDataGrid";
import useAppSelector from "../../hooks/useAppSelector";
import useAppDispatch from "../../hooks/useAppDispatch";
import {
  addPlanAction,
  getPartnerAction,
  getPlansAction,
} from "../../store/actions/partnerActions";
import { IPartner, IPlan } from "@app-models";
import AppModal from "../../components/modal/AppModal";
import AddPlanForm from "../../components/forms/partner/AddPlanForm";
import planModel, { IPlanModel } from "../../components/forms/models/planModel";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { Delete, Visibility } from "@mui/icons-material";

function AddPaymentPlanForm() {
  return null;
}

function PartnerPage() {
  const [partner, setPartner] = useState<IPartner | null>();
  const [openAddPlan, setOpenAddPlan] = useState<boolean>(false);
  const [openAddPaymentPlan, setOpenAddPaymentPlan] = useState<boolean>(false);

  const params = useParams();

  const partnerReducer = useAppSelector((state) => state.partnerReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (partnerReducer.getPartnerStatus === "idle") {
      const id = params.id as unknown as string;

      dispatch(getPartnerAction(+id));
    }
  }, [dispatch, params.id, partnerReducer.getPartnerStatus]);

  useEffect(() => {
    if (partnerReducer.getPlansStatus === "idle") {
      const id = params.id as unknown as string;

      dispatch(getPlansAction(+id));
    }
  }, [dispatch, params.id, partnerReducer.getPlansStatus]);

  useEffect(() => {
    if (partnerReducer.getPartnerStatus === "completed") {
      setPartner(partnerReducer.partner);
    }
  }, [partnerReducer.getPartnerStatus, partnerReducer.partner]);

  const handleOpenAddPlan = () => {
    setOpenAddPlan(true);
  };

  const handleOpenAddPaymentPlan = () => {
    setOpenAddPaymentPlan(true);
  };

  const handleCloseOpenAddPlan = () => {
    setOpenAddPlan(false);
  };

  const handleCloseOpenAddPaymentPlan = () => {
    setOpenAddPaymentPlan(false);
  };

  const handleAddPlan = (
    values: IPlanModel,
    formikHelper: FormikHelpers<IPlanModel>
  ) => {
    const data = {
      label: values.label,
      minVehicles: +values.minVehicles,
      maxVehicles: +values.maxVehicles,
      validity: `${values.validity}months`,
      mobile: +values.mobile,
      driveIn: +values.driveIn,
      inspections: parseInt(values.driveIn) + parseInt(values.mobile),
    };

    if (undefined === params.id) throw Error("Partner ID is required");

    dispatch(addPlanAction({ plan: data, partnerId: params.id }));

    formikHelper.resetForm();
  };

  return (
    <React.Fragment>
      <h1>{partner?.name}</h1>
      <Stack divider={<Divider orientation="horizontal" sx={{ my: 1 }} />}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          <Grid item xs={12} md={6}>
            <Grid container justifyContent="space-between" mb={1}>
              <Grid item>Plans</Grid>
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
              columns={planColumns()}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container justifyContent="space-between" mb={1}>
              <Grid item>Payment Plans</Grid>
              <Grid item>
                <Button
                  onClick={handleOpenAddPaymentPlan}
                  size="small"
                  variant="contained"
                  color="success"
                >
                  Add
                </Button>
              </Grid>
            </Grid>
            <AppDataGrid showToolbar rows={[]} columns={[]} />
          </Grid>
        </Grid>
      </Stack>
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
      <AppModal
        show={openAddPaymentPlan}
        Content={<AddPaymentPlanForm />}
        onClose={handleCloseOpenAddPaymentPlan}
      />
    </React.Fragment>
  );
}

const planColumns = (options?: any) =>
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
      headerName: "Plan Name",
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
      headerName: "Validity",
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

export default PartnerPage;
