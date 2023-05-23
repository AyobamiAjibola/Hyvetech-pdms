import React, { FC, useEffect, useState } from 'react';
import AppModal from '../../components/modal/AppModal';
import { FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import useAppDispatch from '../../hooks/useAppDispatch';
import {
  getAllBankAction,
  initiateAccountTranfer,
  performNameEnquiryAction,
} from '../../store/actions/autoHyveActions';
import useAppSelector from '../../hooks/useAppSelector';
import { clearAccountHolderDetail, clearTransferStatus } from '../../store/reducers/autoHyveReducer';
import AppAlert from '../../components/alerts/AppAlert';
import Checkbox from '@mui/material/Checkbox';
import { getBeneficiariesAction } from '../../store/actions/expenseAction';

interface IProps {
  show?: boolean;
  onClose: () => void;
}

const TransferDialog: FC<IProps> = ({ show = false, onClose }) => {
  //   const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [bank, setBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [narration, setNarration] = useState('');
  const [saveAsBeneficiary, setSaveAsBeneficiary] = useState(false);
  const [useBenenficiary, setUseBeneificary] = useState(false);

  const autohyvePay = useAppSelector(state => state.autoHyveReducer);

  const expense = useAppSelector(state => state.expenseReducer);

  const [alerMessage, setAlert] = useState<{ type: 'success' | 'error' | 'info' | 'warning'; message: string } | null>(
    null,
  );

  const handleOnTranfer = () => {
    if (autohyvePay.accountHolder.beneficiaryName.trim() === '')
      return setAlert({ type: 'error', message: 'Invalid transfer recipient' });

    if (narration.trim() === '') return setAlert({ type: 'error', message: 'Please provide narration' });

    if (`${amount}`.trim() === '' || `${amount}`.trim() === '0')
      return setAlert({ type: 'error', message: 'Please provide transfer amount' });

    const bankSelected = autohyvePay.banks.find(item => item.bankCode === bank);

    if (!bankSelected) return setAlert({ type: 'error', message: 'No bank selected' });

    dispatch(
      initiateAccountTranfer({
        amount: +amount * 100,
        beneficiaryAccount: accountNumber,
        beneficiaryBankCode: bankSelected.bankCode,
        beneficiaryName: autohyvePay.accountHolder.beneficiaryName,
        narration,
        nameEnquiryId: autohyvePay.accountHolder.nameEnquiryID,
        saveAsBeneficiary,
        bankName: bankSelected.bankName,
      }),
    );
  };

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllBankAction());
    dispatch(getBeneficiariesAction());
  }, [dispatch]);

  const handleBeneficiarySelected = (id: string) => {
    const beneficiary = expense.beneficiaries.find(item => item.id === +id);

    if (!beneficiary) return;

    setAccountNumber(beneficiary.accountNumber);
    setBank(beneficiary.bankCode as string);
  };

  useEffect(() => {
    if (accountNumber.length < 10 || bank.trim() === '') return;

    dispatch(clearAccountHolderDetail());

    dispatch(performNameEnquiryAction({ beneficiaryBankCode: bank, beneficiaryAccountNumber: accountNumber }));
  }, [bank, accountNumber]);

  useEffect(() => {
    if (autohyvePay.requestAccountTransferStatus === 'completed') {
      setAlert({ type: 'success', message: 'Transaction successful' });

      onClose();
      dispatch(clearTransferStatus());
    } else if (autohyvePay.requestAccountTransferStatus === 'failed') {
      setAlert({ type: 'error', message: autohyvePay.requestAccountTransferError as string });

      dispatch(clearTransferStatus());
    }
  }, [autohyvePay.requestAccountTransferStatus]);
  return (
    <React.Fragment>
      <AppModal
        size={document.documentElement.clientWidth > 375 ? 'lg' : 'md'}
        fullScreen={false}
        show={show}
        fullWidth={true}
        title="Intiate Transfer"
        Content={
          <React.Fragment>
            <div style={{ marginBottom: 10 }}>
              <TextField
                margin="dense"
                id="amount"
                label="Amount"
                type="number"
                fullWidth
                variant="standard"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <FormControlLabel
                control={<Checkbox onChange={() => setUseBeneificary(state => !state)} />}
                label="Use Exisiting Beneficiary"
              />
            </div>
            {useBenenficiary && (
              <div style={{ marginBottom: 20 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Select Beneficiary</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Select Beneficiary"
                    value={bank}
                    onChange={e => handleBeneficiarySelected(e.target.value)}>
                    {expense.beneficiaries.map((item, i) => (
                      <MenuItem key={i} value={item.id}>
                        {item.accountName} - {item.bankName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}
            <div style={{ marginBottom: 30 }}>
              <TextField
                margin="dense"
                id="accountnumber"
                label="Recipient's Account Number"
                type="number"
                fullWidth
                variant="standard"
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Select Bank</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Recipient Bank"
                  value={bank}
                  onChange={e => setBank(e.target.value)}>
                  {autohyvePay.banks.map(item => (
                    <MenuItem key={item.bankCode} value={item.bankCode}>
                      {item.bankName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div style={{ marginBottom: 20 }}>
              <TextField
                margin="dense"
                id="accoutnname"
                label="Account Name"
                type="text"
                fullWidth
                variant="standard"
                value={autohyvePay.accountHolder.beneficiaryName}
                disabled
              />
            </div>
            <div style={{ marginBottom: 30 }}>
              <TextField
                margin="dense"
                id="narration"
                label="Narration"
                type="text"
                fullWidth
                variant="standard"
                value={narration}
                onChange={e => setNarration(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: 30 }}>
              <FormControlLabel
                control={<Checkbox onChange={() => setSaveAsBeneficiary(state => !state)} />}
                label="Save as Beneficiary"
              />
            </div>

            <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'end' }}>
              <LoadingButton
                loading={
                  autohyvePay.requestNameEnquiryStatus === 'loading' ||
                  autohyvePay.requestAccountTransferStatus === 'loading'
                }
                disabled={
                  autohyvePay.requestNameEnquiryStatus === 'loading' ||
                  autohyvePay.requestAccountTransferStatus === 'loading'
                }
                onClick={handleOnTranfer}
                type="submit"
                variant="contained">
                Tranfer
              </LoadingButton>
            </div>
          </React.Fragment>
        }
        onClose={() => {
          setAccountNumber('');
          setNarration('');
          setBank('');
          setAmount('0');
          dispatch(clearTransferStatus());
          dispatch(clearAccountHolderDetail());
          onClose();
        }}
      />
      <AppAlert
        onClose={() => setAlert(null)}
        alertType={alerMessage ? alerMessage.type : 'info'}
        show={alerMessage !== null}
        message={alerMessage?.message || ''}
      />
    </React.Fragment>
  );
};

export default TransferDialog;
