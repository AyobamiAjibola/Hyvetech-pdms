import React, { useContext, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import useAppSelector from '../../../hooks/useAppSelector';
import useAppDispatch from '../../../hooks/useAppDispatch';
import { getOwnersFilterDataAction, getPartnerAction } from '../../../store/actions/partnerActions';
import { useParams } from 'react-router-dom';
import {
  Autocomplete,
  Box,
  CircularProgress,
  createFilterOptions,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
} from '@mui/material';
import { IDriversFilterData, ITab, PartnerPageContextProps } from '@app-interfaces';
import { ICustomer } from '@app-models';
import AppLoader from '../../loader/AppLoader';
import { getCustomerAction } from '../../../store/actions/customerActions';
import useAdmin from '../../../hooks/useAdmin';
import AppTab from '../../tabs/AppTab';
import { customerSearchResultTabs } from '../../../navigation/menus';
import { CustomerPageContext } from '../../../pages/customer/CustomerPage';
import { clearGetOwnersFilterDataStatus } from '../../../store/reducers/partnerReducer';
import { clearGetCustomersStatus } from '../../../store/reducers/customerReducer';
import { reload } from '../../../utils/generic';
import { PartnerPageContext } from '../../../pages/partner/PartnerPage';
import { REQUIRED_PARTNER_SETTINGS } from '../../../config/constants';

const filterOptions = createFilterOptions({
  matchFrom: 'any',
  stringify: (option: IDriversFilterData) => `${option.query}`,
});

export default function VehicleOwner() {
  const [value, setValue] = React.useState<IDriversFilterData | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = useState<IDriversFilterData[]>([]);
  // @ts-ignore
  const [rawOption, setRawOption] = useState<any>([]);
  const [noOptionsText, setNoOptionsText] = useState<any>('Click Enter to Initialize Search');
  const [showDrop, setShowDrop] = useState<boolean>(false);
  const [customer, setCustomer] = useState<ICustomer>();
  const [tabs, setTabs] = useState<ITab[]>(customerSearchResultTabs);

  console.log(options);

  const params = useParams();
  const admin = useAdmin();

  const { partner } = useContext(PartnerPageContext) as PartnerPageContextProps;

  const partnerReducer = useAppSelector(state => state.partnerReducer);
  const customerReducer = useAppSelector(state => state.customerReducer);
  const dispatch = useAppDispatch();

  const partnerId = useMemo(() => {
    return +(params.id as unknown as string) || admin.user?.partner?.id;
  }, [admin.user, params.id]);

  useEffect(() => {
    if (partner) {
      const requiredPartnerFields = _.pick(partner, Object.keys(REQUIRED_PARTNER_SETTINGS));

      const hasError = Object.values(requiredPartnerFields).some(item => item === null);

      const _tabs = [...tabs];

      if (hasError) {
        const tab = _tabs.find(_tab => _tab.tag === 'estimate');

        if (tab) {
          const index = _tabs.indexOf(tab);
          _tabs[index].disableTab = true;
          _tabs[index].name = 'Create Estimate (Disabled)';
          setTabs(_tabs);
        }
      }
    }
  }, [partner, tabs]);

  useEffect(() => {
    if (partnerId) {
      dispatch(getOwnersFilterDataAction(+partnerId));
      dispatch(getPartnerAction(partnerId));
    }
  }, [dispatch, partnerId]);

  useEffect(() => {
    if (partnerReducer.getOwnersFilterDataStatus === 'completed') {
      // setOptions(partnerReducer.ownersFilterData);
      setRawOption(partnerReducer.ownersFilterData);
    }
  }, [partnerReducer.ownersFilterData, partnerReducer.getOwnersFilterDataStatus]);

  useEffect(() => {
    if (customerReducer.getCustomerStatus === 'completed') {
      if (customerReducer.customer) setCustomer(customerReducer.customer);
    }
  }, [customerReducer.customer, customerReducer.getCustomerStatus]);

  useEffect(() => {
    return () => {
      setCustomer(undefined);
      dispatch(clearGetOwnersFilterDataStatus());
      dispatch(clearGetCustomersStatus());
    };
  }, [dispatch]);

  const handleGetDriverInfo = (id?: number) => {
    if (id) {
      dispatch(getCustomerAction(id));
    }
  };

  const filterData = (_text: string) => {
    const text = _text.toLowerCase();
    //
    // console.log(text)
    setNoOptionsText('Click Enter to Initialize Search');

    const _temp: any = [];
    rawOption.map((_item: any) => {
      // filter logic

      if ((_item?.raw?.email || '').toLowerCase() == text) {
        // check if it's an exact match to email
        _temp.push(_item);
      } else if ((_item?.raw?.phone || '').toLowerCase() == text) {
        // check if it's an exact match to phone
        _temp.push(_item);
      } else if ((_item?.raw?.companyName || '').toLowerCase() == text) {
        // check if it's an exact match to phone
        _temp.push(_item);
      } else if ((_item?.raw?.firstName || '').toLowerCase() == text) {
        // check if it's an exact match to phone
        _temp.push(_item);
      } else if ((_item?.raw?.lastName || '').toLowerCase() == text) {
        // check if it's an exact match to phone
        _temp.push(_item);
      }
    });

    console.log(_temp);

    setOptions(_temp);
  };

  return (
    <CustomerPageContext.Provider value={{ customer, setCustomer }}>
      <Stack direction="column" spacing={5}>
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12} md={6}>
            <Autocomplete
              filterOptions={filterOptions}
              inputValue={inputValue}
              value={value}
              loading={partnerReducer.getDriversFilterDataStatus === 'loading'}
              getOptionLabel={option => option.fullName}
              isOptionEqualToValue={(option, value) => option.fullName === value.fullName}
              onChange={(_: any, newValue: IDriversFilterData | null) => {
                setValue(newValue);
                handleGetDriverInfo(newValue?.id);
              }}
              onInputChange={(_, newInputValue, reason) => {
                setInputValue(newInputValue);
                if (reason === 'clear') {
                  setCustomer(undefined);
                  reload();
                }
              }}
              // noOptionsText="Click Enter to Initialize Search"
              noOptionsText={noOptionsText}
              renderInput={props => (
                <TextField
                  {...props}
                  label="Search customer by First name, last name, car plate number."
                  onChange={e => {
                    // setInputStack(e.target.value)
                    filterData(e.target.value);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      if ((inputValue || '').length == 0) {
                        setShowDrop(false);
                      } else {
                        setNoOptionsText('No result Found');
                        setShowDrop(true);
                      }
                    } else {
                      setShowDrop(false);
                    }
                  }}
                  onBlur={() => {
                    setShowDrop(false);
                  }}
                  InputProps={{
                    ...props.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {partnerReducer.getDriversFilterDataStatus === 'loading' ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {props.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
              options={showDrop ? options : []}
            />
          </Grid>
        </Grid>
        <Box hidden={customer === undefined}>
          <Divider orientation="horizontal" />
          <Paper sx={{ p: 3 }}>
            <AppTab slideDirection="left" tabMenus={tabs} />
          </Paper>
        </Box>
      </Stack>
      <AppLoader show={customerReducer.getCustomerStatus === 'loading'} />
    </CustomerPageContext.Provider>
  );
}
