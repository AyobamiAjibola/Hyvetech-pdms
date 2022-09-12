import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Form, Formik, FormikHelpers, useFormikContext } from "formik";
import { Button, Grid, Stack, Typography } from "@mui/material";
import AppDataGrid from "../../components/tables/AppDataGrid";
import useAppSelector from "../../hooks/useAppSelector";
import useAppDispatch from "../../hooks/useAppDispatch";
import { getPartnerAction } from "../../store/actions/partnerActions";
import { IPartner } from "@app-models";
import AppModal from "../../components/modal/AppModal";
import TextInputField from "../../components/forms/fields/TextInputField";
import { LoadingButton } from "@mui/lab";
import { Save } from "@mui/icons-material";

interface IPlanValues {
  label: string;
  minVehicles: string;
  maxVehicles: string;
  validity: string;
  mobile: string;
  driveIn: string;
}

const planInitialValues: IPlanValues = {
  label: "",
  minVehicles: "0",
  maxVehicles: "0",
  validity: "1",
  mobile: "0",
  driveIn: "0",
};

const paymentPlanInitialValues = {
  name: "",
  label: "",
  discount: "",
  value: "",
  hasPromo: "",
  descriptions: "",
};

function AddPlanForm() {
  const { handleChange, values } = useFormikContext<IPlanValues>();
  return (
    <Form>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        justifyContent="center"
        alignItems="center"
        sx={{ p: 1 }}
      >
        <Grid item xs={12}>
          <TextInputField
            fullWidth
            onChange={handleChange}
            value={values.label}
            name="label"
            label="Name of Plan"
          />
        </Grid>
        <Grid item xs={6}>
          <TextInputField
            fullWidth
            type="number"
            onChange={handleChange}
            value={values.minVehicles}
            name="minVehicles"
            label="Min Vehicles"
          />
        </Grid>
        <Grid item xs={6}>
          <TextInputField
            fullWidth
            type="number"
            onChange={handleChange}
            value={values.maxVehicles}
            name="maxVehicles"
            label="Max Vehicles"
          />
        </Grid>
        <Grid item xs={3}>
          <TextInputField
            fullWidth
            type="number"
            min="1"
            max="12"
            onChange={handleChange}
            value={values.validity}
            name="validity"
            label="Plan Validity (Month)"
          />
        </Grid>
        <Grid item xs={3}>
          <TextInputField
            fullWidth
            type="number"
            onChange={handleChange}
            value={values.driveIn}
            name="driveIn"
            label="No of Drive-in"
          />
        </Grid>
        <Grid item xs={3}>
          <TextInputField
            fullWidth
            type="number"
            onChange={handleChange}
            value={values.mobile}
            name="mobile"
            label="No of Mobile"
          />
        </Grid>
        <Grid item xs={3}>
          <Typography>
            Total Inspections:{" "}
            {parseInt(values.driveIn) + parseInt(values.mobile)}
          </Typography>
        </Grid>
        <Grid item xs mt={1} sx={{ mx: "auto" }}>
          <LoadingButton
            variant="contained"
            color="info"
            fullWidth
            endIcon={<Save />}
          >
            Save
          </LoadingButton>
        </Grid>
      </Grid>
    </Form>
  );
}

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
    values: IPlanValues,
    formikHelper: FormikHelpers<IPlanValues>
  ) => {
    //todo:
    console.log(values);
    formikHelper.resetForm();
  };

  return (
    <React.Fragment>
      <h1>{partner?.name}</h1>
      <Stack>
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
            <AppDataGrid showToolbar rows={[]} columns={[]} />
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
          <Formik initialValues={planInitialValues} onSubmit={handleAddPlan}>
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

export default PartnerPage;
