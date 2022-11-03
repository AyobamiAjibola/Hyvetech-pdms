import React from "react";
import { Grid } from "@mui/material";
import TextField from "@mui/material/TextField";
import SelectField from "../fields/SelectField";
import { PartArgs } from "./EstimateForm";

function QuantityFields(props: PartArgs) {
  const index = props.index;
  const quantity = props.quantity;
  const handleChange = props.handleChange;
  const values = props.values;
  return (
    <React.Fragment>
      {Object.keys(quantity).map((value, idx) => {
        return (
          <Grid key={idx} item xs container spacing={0.2}>
            {value === "quantity" && (
              <Grid item xs>
                <TextField
                  fullWidth
                  variant="outlined"
                  label={value}
                  type="number"
                  inputProps={{
                    min: "0",
                  }}
                  name={`parts.${index}.quantity.quantity`}
                  value={values.parts[index].quantity.quantity}
                  onChange={handleChange}
                />
              </Grid>
            )}
            {value === "unit" && (
              <Grid item xs>
                <SelectField
                  data={[
                    { label: "litre", value: "litre" },
                    { label: "cm", value: "cm" },
                    { label: "kg", value: "kg" },
                    { label: "m", value: "m" },
                  ]}
                  fullWidth
                  label={value}
                  name={`parts.${index}.quantity.unit`}
                  value={values.parts[index].quantity.unit}
                  onChange={handleChange}
                />
              </Grid>
            )}
          </Grid>
        );
      })}
    </React.Fragment>
  );
}

export default QuantityFields;
