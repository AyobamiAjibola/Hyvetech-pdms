import React from "react";
import { Form, useFormikContext } from "formik";
import { Grid, TextField } from "@mui/material";
import { Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import checkListModel from "../models/checkListModel";

interface IProps {
  isSubmitting?: boolean;

  [p: string]: any;
}

const { fields } = checkListModel;

function SectionForm(props: IProps) {
  const { values, handleChange } = useFormikContext<{
    sections: Array<{ title: string; questions: Array<{ question: string }> }>;
  }>();

  return (
    <Form>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        sx={{ p: 1 }}
      >
        <Grid item container xs={12} direction="column">
          <Grid item xs={12}>
            <TextField fullWidth />
          </Grid>
          <Grid item container xs={12}>
            <Grid item xs>
              <TextField fullWidth />
            </Grid>
          </Grid>
        </Grid>
        <Grid item mt={1} xs={12}>
          <LoadingButton
            loading={props.isSubmitting}
            variant="contained"
            type="submit"
            endIcon={<Save />}
          >
            Save
          </LoadingButton>
        </Grid>
      </Grid>
    </Form>
  );
}

export default SectionForm;
