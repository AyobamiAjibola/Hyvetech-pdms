import { useEffect, useState } from 'react';
import { GridSortItem } from '@mui/x-data-grid';
import useAppSelector from './useAppSelector';
import useAppDispatch from './useAppDispatch';
import { getPartnersAction } from '../store/actions/partnerActions';
import { clearGetPartnerStatus } from '../store/reducers/partnerReducer';


export default function usePartner() {
    const [loading, setLoading] = useState<boolean>(false);
    const [rows, setRows] = useState<readonly any[]>([]);
    const [sortModel, setSortModel] = useState<GridSortItem[]>([
      {
        field: 'id',
        sort: 'asc',
      },
    ]);

    const partnerReducer = useAppSelector(state => state.partnerReducer);
    const dispatch = useAppDispatch()

    useEffect(() => {
        return () => {
          dispatch(clearGetPartnerStatus());
        };
      }, [dispatch]);

    useEffect(() => {
        if (partnerReducer.getPartnersStatus === 'idle') {
          dispatch(getPartnersAction());
        }
      }, [dispatch, partnerReducer.getPartnersStatus]);

    useEffect(() => {
        if (partnerReducer.getPartnersStatus === 'loading') {
            setLoading(true);
        }
    }, [partnerReducer.getPartnersStatus, dispatch]);

    useEffect(() => {
        if (partnerReducer.getPartnersStatus === 'completed') {
          setLoading(false);
          setRows(partnerReducer.partners);
        }
    }, [partnerReducer.partners, partnerReducer.getPartnersStatus]);

    useEffect(() => {
        if (partnerReducer.getPartnersStatus === 'failed') {
            setLoading(true);
        }
    }, [partnerReducer.getPartnersStatus]);

    return {
        rows,
        sortModel,
        setSortModel,
        loading,
    }
}