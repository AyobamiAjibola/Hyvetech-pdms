import checkListModel, { ICheckListValues } from "../models/checkListModel";
import React, { useContext, useEffect, useState } from "react";
import SelectField, { ISelectData } from "../fields/SelectField";
import { Form, useFormikContext } from "formik";
import { CheckListsPageContextProps } from "@app-interfaces";
import { Grid } from "@mui/material";
import TextInputField from "../fields/TextInputField";
import { LoadingButton } from "@mui/lab";
import { Send } from "@mui/icons-material";
import { CheckListsPageContext } from "../../../pages/checkList/CheckListsPage";
import { GARAGE_CATEGORY } from "../../../config/constants";

const { fields } = checkListModel;

interface ICheckListFormProps {
  isSubmitting?: boolean;
}

export default function CheckListForm(props: ICheckListFormProps) {
  const [options, setOptions] = useState<ISelectData[]>([]);

  const { handleChange, values, resetForm } = useFormikContext<ICheckListValues>();
  const { partners, showCreate, showEdit } = useContext(CheckListsPageContext) as CheckListsPageContextProps;

  useEffect(() => {
    if (!showCreate || !showEdit) resetForm();
  }, [showEdit, showCreate, resetForm]);

  useEffect(() => {
    if (partners.length) {
      const garages = partners.filter((value) => {
        return value.categories.some((cat) => cat.name === GARAGE_CATEGORY);
      });

      setOptions(
        garages.map((garage) => ({
          label: garage.name,
          value: `${garage.id}`,
        }))
      );
    }
  }, [partners]);

  return (
    <Form>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} sx={{ p: 1 }}>
        <Grid item xs={12}>
          <TextInputField
            onChange={handleChange}
            value={values.checkList}
            name={fields.checkList.name}
            label={fields.checkList.label}
          />
        </Grid>
        <Grid item xs={12}>
          <SelectField
            onChange={handleChange}
            value={values.partners}
            name={fields.partners.name}
            label={fields.partners.label}
            multiple
            fullWidth
            data={options}
          />
        </Grid>
        <Grid item xs={12}>
          <TextInputField
            multiline
            rows={2}
            onChange={handleChange}
            value={values.description}
            name={fields.description.name}
            label={fields.description.label}
            data={options}
          />
        </Grid>
        <Grid item xs={12}>
          <LoadingButton
            type="submit"
            loading={props.isSubmitting}
            fullWidth
            endIcon={<Send />}
            variant="contained"
            color="secondary"
            size="large"
          >
            Submit
          </LoadingButton>
        </Grid>
      </Grid>
    </Form>
  );
}
