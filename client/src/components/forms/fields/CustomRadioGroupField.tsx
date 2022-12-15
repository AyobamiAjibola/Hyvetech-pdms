import React, { ChangeEvent } from 'react';

import { Radio, RadioGroup, Sheet, Theme } from '@mui/joy';
import { Button } from '@mui/material';

interface IProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
  value: string;
}

function CustomRadioGroupField(props: IProps) {
  return (
    <RadioGroup aria-labelledby="radio-group-label" size="lg" sx={{ gap: 1.5 }}>
      <Sheet sx={{ p: 2, borderRadius: 'md' }}>
        <Radio
          component={props1 => <Button {...props1} />}
          label={props.label}
          overlay
          disableIcon
          value={props.value}
          onChange={props.onChange}
          componentsProps={{
            label: (checked: boolean) => ({
              sx: {
                fontWeight: 'lg',
                fontSize: 'md',
                color: checked ? 'text.primary' : 'text.secondary',
              },
            }),
            action: (checked: boolean) => ({
              sx: (theme: Theme) => ({
                ...(checked && {
                  '--variant-borderWidth': '2px',
                  '&&': {
                    // && to increase the specificity to win the base :hover styles
                    borderColor: theme.vars.palette.primary[500],
                  },
                }),
              }),
            }),
          }}
        />
      </Sheet>
    </RadioGroup>
  );
}

export default CustomRadioGroupField;
