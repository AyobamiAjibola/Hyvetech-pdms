import React from "react";
import { Box } from "@mui/material";
import { Formik } from "formik";
import estimateModel, {
  IEstimateValues,
} from "../../forms/models/estimateModel";
import EstimateForm from "../../forms/estimate/EstimateForm";

const { initialValues, schema } = estimateModel;

function Estimate() {
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

export default Estimate;
