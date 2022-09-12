import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Grid, Stack } from "@mui/material";
import AppDataGrid from "../../components/tables/AppDataGrid";
import useAppSelector from "../../hooks/useAppSelector";
import useAppDispatch from "../../hooks/useAppDispatch";
import { getPartnerAction } from "../../store/actions/partnerActions";
import { IPartner } from "@app-models";
import AppModal from "../../components/modal/AppModal";

const planInitialValues = {
  label: "",
  minVehicles: "",
  maxVehicles: "",
  validity: "",
  inspections: "",
  mobile: "",
  driveIn: "",
};

const paymentPlanInitialValues = {};

function AddPlanForm() {
  return null;
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
        show={openAddPlan}
        Content={<AddPlanForm />}
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
