import React from 'react';
import { Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import SelectField from '../fields/SelectField';
import { PartArgs } from './EstimateForm';

function WarrantyFields(props: PartArgs) {
  const index = props.index;
  const warranty = props.warranty;
  const handleChange = props.handleChange;
  const values = props.values;

  return (
    <React.Fragment>
      {Object.keys(warranty).map((value, idx) => {
        return (
          <Grid key={idx} item xs container>
            {value === 'warranty' && (
              <Grid item sm={12} xs={16}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label={value}
                  type="number"
                  inputProps={{
                    min: '0',
                  }}
                  onChange={handleChange}
                  name={`parts.${index}.warranty.warranty`}
                  value={values.parts[index].warranty.warranty}
                />
              </Grid>
            )}
            {value === 'interval' && (
              <Grid item xs>
                <SelectField
                  data={[
                    { label: 'day', value: 'day' },
                    { label: 'week', value: 'week' },
                    { label: 'month', value: 'month' },
                    { label: 'year', value: 'year' },
                  ]}
                  fullWidth
                  label={value}
                  onChange={handleChange}
                  name={`parts.${index}.warranty.interval`}
                  value={values.parts[index].warranty.interval}
                />
              </Grid>
            )}
          </Grid>
        );
      })}
    </React.Fragment>
  );
}

export default WarrantyFields;
