import { Edit, Save, ToggleOff, ToggleOn, Update } from '@mui/icons-material';
import {
  Button,
  Chip,
  Divider,
  Grid,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useAppDispatch from '../../../hooks/useAppDispatch';
import useAppSelector from '../../../hooks/useAppSelector';
import AppAlert from '../../alerts/AppAlert';
import AppDataGrid from '../../tables/AppDataGrid';
import {
  createRoleAction,
  createUserAction,
  getPermissionsActions,
  getRoleActions,
  getUsersAction,
  updateRoleAction,
  updateUserAction,
  updateUserStatusAction,
} from '../../../store/actions/userActions';
import AppModal from '../../modal/AppModal';
import { Formik } from 'formik';
import { FaPlus } from 'react-icons/fa';
import { LoadingButton } from '@mui/lab';
import Checkbox from '@mui/material/Checkbox';
import { clearCreateRoleStatus, clearCreateUserStatus } from '../../../store/reducers/userReducer';
import { IRole, IUser, IUserUpdate } from '@app-models';
import _ from 'lodash';
import CapitalizeWord from '../../../utils/capitalizeWord';

const UserRoleManagement = () => {
  const store = useAppSelector(item => item.userReducer);
  const dispatch = useAppDispatch();
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [permissions, setPermissions] = useState<string[]>([]);
  const [alerMessage, setAlert] = useState<{ type: 'success' | 'error' | 'info' | 'warning'; message: string } | null>(
    null,
  );

  const [showCreateUser, setShowCreateUser] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(-1);

  const handleChange = (event: SelectChangeEvent<typeof permissions>) => {
    const {
      target: { value },
    } = event;
    console.log(value);
    setPermissions(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  const getUsers = useCallback(() => {
    dispatch(getUsersAction());
    dispatch(getPermissionsActions());
    dispatch(getRoleActions());
  }, []);
  useEffect(() => {
    getUsers();
  }, [getUsers]);
  const userColumns = useMemo(() => {
    return [
      {
        field: 'id',
        headerName: 'ID #',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 100,
      },
      {
        field: 'firstName',
        headerName: 'Name',
        headerAlign: 'center',
        align: 'center',
        width: 250,
        type: 'string',
        renderCell: params => {
          return `${params.row.firstName} ${params.row.lastName}`;
        },
      },
      {
        field: 'email',
        headerName: 'Email',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 200,
        sortable: true,
      },
      {
        field: 'roles',
        headerName: 'Role',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 200,
        sortable: true,
        renderCell: params => {
          return params.row.roles[0]?.name || '';
        },
      },
      {
        field: 'active',
        headerName: 'Status',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 100,
        sortable: true,
        renderCell: params => {
          return params.row.active ? (
            <Chip label={'Active'} size="small" color="success" />
          ) : (
            <Chip label={'InActive'} size="small" color="info" />
          );
        },
      },
      {
        field: 'phone',
        headerName: 'Phone number',
        headerAlign: 'center',
        align: 'center',
        type: 'string',

        sortable: true,
        width: 150,
      },

      {
        field: 'actions',
        type: 'actions',
        headerAlign: 'center',
        align: 'center',
        headerName: 'Actions',
        width: 200,
        getActions: (params: any) => {
          const row = params.row as IUser;

          return [
            // <GridActionsCellItem
            //   key={0}
            //   icon={<Visibility sx={{ color: 'dodgerblue' }} />}
            //   onClick={() => {
            //     void dispatch(getEstimatesAction());
            //     navigate(`/estimates/${row.id}`, { state: { estimate: row } });
            //   }}
            //   label="View"
            //   showInMenu={false}
            // />,
            // <GridActionsCellItem
            //   sx={{ display: isTechAdmin ? 'block' : 'none' }}
            //   key={1}
            //   icon={<ViewAgenda sx={{ color: 'limegreen' }} />}
            //   //  onClick={() => estimate.onEdit(row.id)}
            //   //disabled={!isTechAdmin || row.status === ESTIMATE_STATUS.invoiced}
            //   disabled={!isTechAdmin}
            //   label="View"
            //   showInMenu={false}
            // />,

            <GridActionsCellItem
              sx={{ display: 'block' }}
              key={1}
              icon={<Edit sx={{ color: 'limegreen' }} />}
              onClick={() => handleOnEditUser(row)}
              //disabled={!isTechAdmin || row.status === ESTIMATE_STATUS.invoiced}

              label="Edit"
              showInMenu={false}
            />,
            <GridActionsCellItem
              sx={{ display: 'block' }}
              key={2}
              onClick={() => handleDisableUser(row)}
              icon={row.active ? <ToggleOn color="success" /> : <ToggleOff color="warning" />}
              label="Toggle"
              //  disabled={row.status === ESTIMATE_STATUS.invoiced}
              showInMenu={false}
            />,
          ];
        },
      },
    ] as GridColDef<IUser>[];
  }, []);

  const handleDisableUser = (user: IUser) => {
    setEditMode(true);
    dispatch(updateUserStatusAction({ userId: user.id }));
  };

  const handleOnEditUser = (user: IUser) => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
    setRole(user.roles[0]?.id);
    setPhone(user.phone);
    setShowCreateUser(true);
    setEditMode(true);
    setUserId(user.id);
  };

  const roleColumns = useMemo(() => {
    return [
      {
        field: 'id',
        headerName: 'ID #',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 100,
      },
      {
        field: 'name',
        headerName: 'Role Name',
        headerAlign: 'center',
        align: 'center',
        width: 200,
        type: 'string',
      },

      {
        field: 'permissions',
        headerName: 'Permissions',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 600,
        sortable: true,
        renderCell: params => {
          return params.row.permissions.map(item => item.name).join(',');
          //    return params.row.active ? (
          //      <Chip label={'Active'} size="small" color="success" />
          //    ) : (
          //      <Chip label={'InActive'} size="small" color="info" />
          //    );
        },
      },

      // {
      //   field: 'createdAt',
      //   headerName: 'Date Created',
      //   headerAlign: 'center',
      //   align: 'center',
      //   width: 200,
      //   type: 'string',
      //   valueFormatter: ({ value }) => {
      //     return value ? moment(value).format('LLL') : '-';
      //   },
      //   sortable: true,
      // },
      {
        field: 'actions',
        type: 'actions',
        headerAlign: 'center',
        align: 'center',
        headerName: 'Actions',
        getActions: (params: any) => {
          const row = params.row as IRole;

          return [
            // <GridActionsCellItem
            //   key={0}
            //   icon={<Visibility sx={{ color: 'dodgerblue' }} />}
            //   onClick={() => {
            //     void dispatch(getEstimatesAction());
            //     navigate(`/estimates/${row.id}`, { state: { estimate: row } });
            //   }}
            //   label="View"
            //   showInMenu={false}
            // />,
            // <GridActionsCellItem
            //   sx={{ display: isTechAdmin ? 'block' : 'none' }}
            //   key={1}
            //   icon={<ViewAgenda sx={{ color: 'limegreen' }} />}
            //   //  onClick={() => estimate.onEdit(row.id)}
            //   //disabled={!isTechAdmin || row.status === ESTIMATE_STATUS.invoiced}
            //   disabled={!isTechAdmin}
            //   label="View"
            //   showInMenu={false}
            // />,

            <GridActionsCellItem
              sx={{ display: 'block' }}
              key={1}
              icon={<Edit sx={{ color: 'limegreen' }} />}
              onClick={() => handleRoleEdit(row)}
              //disabled={!isTechAdmin || row.status === ESTIMATE_STATUS.invoiced}

              label="Edit"
              showInMenu={false}
            />,
          ];
        },
      },
    ] as GridColDef<IRole>[];
  }, []);

  const [editMode, setEditMode] = useState(false);

  const handleRoleEdit = (role: IRole) => {
    setRoleName(role.name);
    setEditMode(true);
    setRole(role.id);
    setPermissions(role.permissions.map(item => item.name));

    setShowCreateRole(true);
  };

  const handleRoleUpdate = () => {
    dispatch(updateRoleAction({ id: role, permissions }));
  };

  useEffect(() => {
    if (store.createRoleStatus === 'completed') {
      setAlert({ message: editMode ? 'Role updated successfully' : 'Role created successfully', type: 'success' });
      dispatch(getRoleActions());
      setShowCreateRole(false);
      dispatch(clearCreateRoleStatus());
    } else if (store.createRoleStatus === 'failed') {
      setAlert({ message: store.createRoleError || 'Operation failed', type: 'error' });
      dispatch(clearCreateRoleStatus());
    }

    return () => {
      dispatch(clearCreateRoleStatus());
    };
  }, [store.createRoleStatus]);

  useEffect(() => {
    if (store.createUserStatus === 'completed') {
      setAlert({ message: editMode ? 'User updated successfully' : 'User created successfully', type: 'success' });
      dispatch(getUsersAction());
      setShowCreateUser(false);
      dispatch(clearCreateUserStatus);
      setEditMode(false);
    } else if (store.createUserStatus === 'failed') {
      setAlert({ message: store.createUserError || 'Operation failed', type: 'error' });
      dispatch(clearCreateUserStatus());
    }

    return () => {
      dispatch(clearCreateUserStatus());
    };
  }, [store.createUserStatus]);

  const handleCreateRole = useCallback(() => {
    if (roleName.trim() === '') return setAlert({ message: 'Role name is required', type: 'info' });
    if (permissions.length === 0) return setAlert({ message: 'Please select atleast one permission', type: 'info' });

    dispatch(createRoleAction({ name: roleName, permissions }));
  }, [roleName, permissions]);

  const [role, setRole] = useState(-1);

  const handleCreateUser = () => {
    if (firstName.trim() === '') return setAlert({ message: 'First name is required', type: 'info' });
    if (lastName.trim() === '') return setAlert({ message: 'Last name is required', type: 'info' });
    if (email.trim() === '') return setAlert({ message: 'Email is required', type: 'info' });
    if (phone.trim() === '') return setAlert({ message: 'Phone is required', type: 'info' });

    if (password.trim() === '') return setAlert({ message: 'Password is required', type: 'info' });

    if (role === -1) return setAlert({ message: 'Role is required', type: 'info' });

    dispatch(createUserAction({ firstName, lastName, email, password, roleId: role, phone }));
  };

  const clearState = () => {
    setEditMode(false);
    setRole(-1);
    setUserId(-1);
  };

  useEffect(() => {
    if (showCreateRole) return;

    clearState();
  }, [showCreateRole]);

  useEffect(() => {
    if (showCreateUser) return;

    clearState();
  }, [showCreateUser]);

  const handleUpdateUser = () => {
    if (firstName.trim() === '') return setAlert({ message: 'First name is required', type: 'info' });
    if (lastName.trim() === '') return setAlert({ message: 'Last name is required', type: 'info' });
    if (email.trim() === '') return setAlert({ message: 'Email is required', type: 'info' });
    if (phone.trim() === '') return setAlert({ message: 'Phone is required', type: 'info' });

    if (role === -1) return setAlert({ message: 'Role is required', type: 'info' });

    const payload: IUserUpdate = {
      firstName,
      lastName,
      email,
      phone,
      roleId: role,
      id: userId,
    };

    if (password.trim() !== '') payload.password = password;

    dispatch(updateUserAction(payload));
  };

  return (
    <div>
      <Grid container>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={6}>
            <Typography variant="h4" gutterBottom>
              Roles
            </Typography>
          </Grid>
          <Grid container spacing={4} justifyContent="end" xs={6}>
            <Grid item>
              <Button onClick={() => setShowCreateRole(true)} variant="outlined" color="success" size="small">
                Add Role
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid container style={{ marginTop: 10 }}>
          <Grid item xs={12}>
            <AppDataGrid
              rows={store.roles}
              columns={roleColumns}
              showToolbar
              loading={store.getRoleStatus === 'loading'}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid style={{ marginTop: 20 }} container>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={6}>
            <Typography variant="h4" gutterBottom>
              Users
            </Typography>
          </Grid>
          <Grid container spacing={4} justifyContent="end" xs={6}>
            <Grid item>
              <Button onClick={() => setShowCreateUser(true)} variant="outlined" color="secondary" size="small">
                Add User
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid container style={{ marginTop: 10 }}>
          <Grid item xs={12}>
            <AppDataGrid
              rows={store.users}
              columns={userColumns}
              showToolbar
              loading={store.getUsersStatus === 'loading'}
            />
          </Grid>
        </Grid>
      </Grid>
      {showCreateRole && (
        <AppModal
          fullWidth
          size="md"
          show={showCreateRole}
          Content={
            <Formik
              initialValues={{}}
              onSubmit={(values, formikHelpers) => {
                console.log(values, formikHelpers);
              }}
              enableReinitialize
              validateOnChange>
              <div style={{ marginTop: 20, marginBottom: 20 }}>
                <Typography
                  style={{
                    marginBottom: 20,
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}>
                  {editMode ? (
                    'Update Role '
                  ) : (
                    <React.Fragment>
                      <FaPlus style={{ marginRight: 8 }} />
                      Add Role
                    </React.Fragment>
                  )}
                </Typography>
                <Grid spacing={10} container>
                  <Grid item md={12} sm={12}>
                    <TextField
                      value={roleName}
                      onChange={e => setRoleName(e.target.value)}
                      fullWidth
                      variant="outlined"
                      name={`roleName`}
                      label="Role name"
                      disabled={editMode}
                    />
                  </Grid>
                </Grid>
                <Grid style={{ marginTop: 20 }} container>
                  <Grid item md={12}>
                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      fullWidth
                      value={permissions}
                      label="Select Permission"
                      onChange={handleChange}
                      input={<OutlinedInput label="Tag" />}
                      renderValue={selected => selected.join(', ')}>
                      {(store.permissions || []).map(item => (
                        <MenuItem key={item.permission_id} value={item.name}>
                          <Checkbox checked={permissions.indexOf(item.name) > -1} />
                          <ListItemText primary={CapitalizeWord.capitalize(item.name.replace(/_/g, ' '))} />
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                </Grid>
                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                <LoadingButton
                  type="submit"
                  loading={store.createRoleStatus === 'loading'}
                  disabled={store.createRoleStatus === 'loading'}
                  // disabled={
                  //   saveStatus || values.status === ESTIMATE_STATUS.sent || values.status === ESTIMATE_STATUS.invoiced
                  // }
                  onClick={editMode ? handleRoleUpdate : handleCreateRole}
                  variant="contained"
                  color="secondary"
                  endIcon={editMode ? <Update /> : <Save />}>
                  {editMode ? 'Update' : 'Save'}
                </LoadingButton>
              </div>
            </Formik>
          }
          onClose={() => setShowCreateRole(false)}
        />
      )}

      {showCreateUser && (
        <AppModal
          fullWidth
          size="md"
          show={showCreateUser}
          Content={
            <Formik
              initialValues={{}}
              onSubmit={(values, formikHelpers) => {
                console.log(values, formikHelpers);
              }}
              enableReinitialize
              validateOnChange>
              <div style={{ marginTop: 20, marginBottom: 20 }}>
                <Typography
                  style={{
                    marginBottom: 20,
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}>
                  {editMode ? (
                    'Update User'
                  ) : (
                    <React.Fragment>
                      <FaPlus style={{ marginRight: 8 }} />
                      Add User
                    </React.Fragment>
                  )}
                </Typography>
                <Grid spacing={4} container>
                  <Grid item md={6} sm={6}>
                    <TextField
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      fullWidth
                      variant="outlined"
                      name={`firstName`}
                      label="First name"
                    />
                  </Grid>
                  <Grid item md={6} sm={6}>
                    <TextField
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      fullWidth
                      variant="outlined"
                      name={`lastName`}
                      label="Last name"
                    />
                  </Grid>
                </Grid>
                <Grid spacing={4} style={{ marginTop: 20 }} container>
                  <Grid item md={6} sm={6}>
                    <TextField
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      fullWidth
                      variant="outlined"
                      name={`Email`}
                      label="Email"
                    />
                  </Grid>
                  <Grid item md={6} sm={6}>
                    <TextField
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      fullWidth
                      variant="outlined"
                      name={`phone`}
                      label="Phone Number"
                    />
                  </Grid>
                </Grid>
                <Grid style={{ marginTop: 20 }} spacing={4} container>
                  <Grid item md={6} sm={6}>
                    <TextField
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      fullWidth
                      variant="outlined"
                      name={`password`}
                      label="Password"
                    />
                  </Grid>
                  <Grid item md={6}>
                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      fullWidth
                      label="Select Permission"
                      value={role}
                      onChange={e => setRole(+e.target.value)}
                      input={<OutlinedInput label="Tag" />}>
                      {(store.roles || []).map(item => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                </Grid>
                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                <LoadingButton
                  type="submit"
                  loading={store.createRoleStatus === 'loading'}
                  disabled={store.createRoleStatus === 'loading'}
                  // disabled={
                  //   saveStatus || values.status === ESTIMATE_STATUS.sent || values.status === ESTIMATE_STATUS.invoiced
                  // }
                  onClick={editMode ? handleUpdateUser : handleCreateUser}
                  variant="contained"
                  color="secondary"
                  endIcon={editMode ? <Update /> : <Save />}>
                  {editMode ? 'Update' : 'Save'}
                </LoadingButton>
              </div>
            </Formik>
          }
          onClose={() => setShowCreateUser(false)}
        />
      )}
      <AppAlert
        onClose={() => setAlert(null)}
        alertType={alerMessage?.type || 'info'}
        show={alerMessage !== null}
        message={alerMessage?.message}
      />
    </div>
  );
};

export default UserRoleManagement;
