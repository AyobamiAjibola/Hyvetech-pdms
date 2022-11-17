import * as React from "react";
import { ChangeEvent, FocusEvent } from "react";
import { Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import ErrorField from "./ErrorField";
import { useFormikContext } from "formik";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  };
}

interface IProps {
  options: string[];
  inputGroupStyle?: { [p: string]: string };
  textInputStyle?: { [p: string]: string };
  helperStyle?: { [p: string]: string };
  fullWidth?: boolean;
  size?: "small" | "medium";
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  value: string[];
  name: string;
  label: string;

  [p: string]: any;
}

export default function WorkingDaysSelectField(props: IProps) {
  const { errors, touched, setFieldValue } = useFormikContext();

  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent<typeof props.value>) => {
    const {
      target: { value },
    } = event;
    setFieldValue(props.name, typeof value === "string" ? value.split(",") : value);
  };

  return (
    <div>
      <FormControl
        // @ts-ignore
        error={errors[props.name] && touched[props.name]}
        fullWidth={props.fullWidth}
      >
        <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>
        <Select
          {...props}
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={props.value}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label={props.label} />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {props.options.map((name) => (
            <MenuItem key={name} value={name} style={getStyles(name, props.value, theme)}>
              {name}
            </MenuItem>
          ))}
        </Select>
        <ErrorField
          helperStyle={props.helperStyle}
          // @ts-ignore
          message={errors[props.name]}
          // @ts-ignore
          hasError={errors[props.name] && touched[props.name]}
        />
      </FormControl>
    </div>
  );
}
