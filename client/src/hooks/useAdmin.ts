import { CustomJwtPayload } from '@app-interfaces';
import { IPermission, IUser } from '@app-models';
import jwt from 'jsonwebtoken';
import { useEffect, useMemo, useState } from 'react';

import { LOCAL_STORAGE } from '../config/constants';
import settings from '../config/settings';
import { getUserAction } from '../store/actions/userActions';
import useAppDispatch from './useAppDispatch';
import useAppSelector from './useAppSelector';

export default function useAdmin() {
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
  const [isTechAdmin, setIsTechAdmin] = useState<boolean>(false);
  const [isDriverAdmin, setIsDriverAdmin] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);

  const userReducer = useAppSelector(state => state.userReducer);
  const dispatch = useAppDispatch();

  const token = useMemo(() => sessionStorage.getItem(settings.auth.admin), []);

  useEffect(() => {
    const localPermissions = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE.permissions) as string);

    if (null !== localPermissions) {
      const permissions = localPermissions as IPermission[];

      permissions.forEach(permission => {
        if (permission.action === 'manage' && permission.subject === 'all') setIsSuperAdmin(true);

        if (permission.action === 'manage' && permission.subject === 'driver') setIsDriverAdmin(true);

        if (permission.action === 'manage' && permission.subject === 'technician') setIsTechAdmin(true);
        // else setIsTechAdmin(true);
      });
    } else throw new Error('You are not authorized to access this resource');
  }, []);

  useEffect(() => {
    if (token) {
      const payload = jwt.decode(token) as CustomJwtPayload;

      dispatch(getUserAction(payload.userId));
    } else throw new Error('You are not authorized to access this resource');
  }, [dispatch, token]);

  useEffect(() => {
    if (userReducer.getUserStatus === 'completed') {
      setUser(userReducer.user);
    }
  }, [userReducer.getUserStatus, userReducer.user]);

  return {
    isSuperAdmin,
    isTechAdmin,
    isDriverAdmin,
    user,
  };
}
