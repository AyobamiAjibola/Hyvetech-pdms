import React, { useContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Formik } from "formik";
import estimateModel, {
  IEstimateValues,
} from "../../forms/models/estimateModel";
import EstimateForm from "../../forms/estimate/EstimateForm";
import { RideShareDriverPageContext } from "./RideShareDriver";
import { RideShareDriverPageContextProps } from "@app-interfaces";

const { schema } = estimateModel;

export default function Estimate() {
  const [initialValues, setInitialValues] = useState<IEstimateValues>(
    estimateModel.initialValues
  );

  const { driver } = useContext(
    RideShareDriverPageContext
  ) as RideShareDriverPageContextProps;

  useEffect(() => {
    if (driver) {
      setInitialValues((prevState) => ({
        ...prevState,
        firstName: driver.firstName,
        lastName: driver.lastName,
        phone: driver.phone,
        address: driver?.contacts[0].address,
      }));
    }
  }, [driver]);

  const handleCreateEstimate = (values: IEstimateValues) => {
    console.log(values);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ minWidth: "100%" }}>
        <Formik
          onSubmit={handleCreateEstimate}
          initialValues={initialValues}
          validationSchema={schema}
          enableReinitialize
        >
          <EstimateForm />
        </Formik>
      </Box>
    </Box>
  );
}
