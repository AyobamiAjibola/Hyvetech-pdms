import React, { useEffect, useState } from "react";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { Delete, Visibility } from "@mui/icons-material";
import { IPaymentPlan } from "@app-models";
import AppDataGrid from "../../tables/AppDataGrid";
import useAppSelector from "../../../hooks/useAppSelector";
import { Button, Grid } from "@mui/material";
import { CustomHookMessage } from "@app-types";
import { useParams } from "react-router-dom";
import useAppDispatch from "../../../hooks/useAppDispatch";
import AppModal from "../../modal/AppModal";
import { Formik, FormikHelpers } from "formik";
import paymentPlanModel, {
  IPaymentPlanModel,
} from "../../forms/models/paymentPlanModel";
import AddPaymentPlanForm from "../../forms/partner/AddPaymentPlanForm";
import { addPaymentPlanAction } from "../../../store/actions/partnerActions";
import AppAlert from "../../alerts/AppAlert";
import moment from "moment";

function PaymentPlans() {
  const [openAddPaymentPlan, setOpenAddPaymentPlan] = useState<boolean>(false);
  const [error, setError] = useState<CustomHookMessage>();

  const params = useParams();

  const partnerReducer = useAppSelector((state) => state.partnerReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (partnerReducer.addPaymentPlanStatus === "completed") {
      setOpenAddPaymentPlan(false);
    }
  }, [partnerReducer.addPaymentPlanStatus]);

  const handleOpenAddPaymentPlan = () => {
    setOpenAddPaymentPlan(true);
  };

  const handleCloseOpenAddPaymentPlan = () => {
    setOpenAddPaymentPlan(false);
  };

  const handleAddPaymentPlan = (
    values: IPaymentPlanModel,
    formikHelper: FormikHelpers<IPaymentPlanModel>
  ) => {
    const data = {
      name: values.name,
      discount: values.discount,
      plan: values.plan,
      coverage: values.coverage,
      descriptions: values.description,
      parameters: values.parameter,
      pricing: values.pricing,
    };

    values.pricing.forEach((value) => {
      if (!value.interval.length || !value.amount.length) {
        return setError({ message: "Pricing is required." });
      }
    });

    if (undefined === params.id) throw Error("Partner ID is required");

    dispatch(addPaymentPlanAction({ paymentPlan: data, partnerId: params.id }));

    formikHelper.resetForm();
  };

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Grid container justifyContent="space-between" mb={1}>
          <Grid item />
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
        <AppDataGrid
          loading={partnerReducer.getPaymentPlansStatus === "loading"}
          showToolbar
          rows={partnerReducer.paymentPlans}
          columns={columns()}
        />
      </Grid>
      <AppModal
        fullWidth
        size="md"
        show={openAddPaymentPlan}
        Content={
          <Formik
            initialValues={paymentPlanModel.initialValues}
            validationSchema={paymentPlanModel.schema}
            onSubmit={handleAddPaymentPlan}
          >
            <AddPaymentPlanForm />
          </Formik>
        }
        onClose={handleCloseOpenAddPaymentPlan}
      />
      <AppAlert
        alertType="error"
        show={undefined !== error?.message}
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
      field: "name",
      headerName: "Name",
      headerAlign: "left",
      width: 220,
      align: "left",
      type: "string",
      sortable: true,
    },
    {
      field: "plan",
      headerName: "Plan",
      headerAlign: "center",
      width: 300,
      align: "center",
      type: "string",
      sortable: true,
      valueGetter: (params) => {
        const plan = params.row.plan;

        return plan ? plan.label.replaceAll("_", " ") : "";
      },
    },
    {
      field: "coverage",
      headerName: "Coverage",
      headerAlign: "center",
      width: 180,
      align: "center",
      type: "string",
      sortable: true,
      valueGetter: (params) => {
        const coverage = params.row.coverage;

        return coverage ? coverage.replaceAll("_", " ") : "";
      },
    },
    {
      field: "createdAt",
      headerName: "Created At",
      headerAlign: "center",
      width: 180,
      align: "center",
      type: "string",
      sortable: true,
      valueFormatter: (params) => {
        const date = params.value;

        return date ? moment(date).utc(true).format("LL") : "";
      },
    },
    {
      field: "updatedAt",
      headerName: "Modified At",
      headerAlign: "center",
      width: 180,
      align: "center",
      type: "string",
      sortable: true,
      valueFormatter: (params) => {
        const date = params.value;

        return date ? moment(date).utc(true).format("LL") : "";
      },
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
  ] as GridColDef<IPaymentPlan>[];

export default PaymentPlans;
