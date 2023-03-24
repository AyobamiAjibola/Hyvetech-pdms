import { IThunkAPIStatus } from '@app-types';
import { IPermission, IRole, IUser } from '@app-models';
import { createSlice } from '@reduxjs/toolkit';
import {
  createRoleAction,
  createUserAction,
  getPermissionsActions,
  getRoleActions,
  getUserAction,
  getUsersAction,
  updateRoleAction,
  updateUserAction,
  updateUserStatusAction,
} from '../actions/userActions';

interface IUserState {
  getUserStatus: IThunkAPIStatus;
  getUserSuccess: string;
  getUserError?: string;

  getUsersStatus: IThunkAPIStatus;
  getUsersSuccess: string;
  getUsersError?: string;

  getPermissionsStatus: IThunkAPIStatus;
  getPermissionsSuccess: string;
  getPermissionsError?: string;

  getRolesStatus: IThunkAPIStatus;
  getRolesSuccess: string;
  getRolesError?: string;

  getRoleStatus: IThunkAPIStatus;
  getRoleSuccess: string;
  getRoleError?: string;

  createUserStatus: IThunkAPIStatus;
  createUserSuccess: string;
  createUserError?: string;

  createRoleStatus: IThunkAPIStatus;
  createRoleSuccess: string;
  createRoleError?: string;

  users: IUser[];
  user: IUser | null;

  permissions: IPermission[];
  roles: IRole[];

  role: IRole | null;
}

const initialState: IUserState = {
  getUserError: '',
  getUserStatus: 'idle',
  getUserSuccess: '',
  getUsersError: '',
  getUsersStatus: 'idle',
  getUsersSuccess: '',

  getPermissionsError: '',
  getPermissionsStatus: 'idle',
  getPermissionsSuccess: '',

  getRolesError: '',
  getRolesStatus: 'idle',
  getRolesSuccess: '',

  createRoleError: '',
  createRoleStatus: 'idle',
  createRoleSuccess: '',

  createUserError: '',
  createUserStatus: 'idle',
  createUserSuccess: '',

  getRoleError: '',
  getRoleStatus: 'idle',
  getRoleSuccess: '',

  user: null,
  users: [],

  permissions: [],
  roles: [],

  role: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearGetUsersStatus(state: IUserState) {
      state.getUsersStatus = 'idle';
      state.getUsersSuccess = '';
      state.getUsersError = '';
    },
    clearGetUserStatus(state: IUserState) {
      state.getUserStatus = 'idle';
      state.getUserSuccess = '';
      state.getUserError = '';
    },

    clearCreateRoleStatus(state: IUserState) {
      state.createRoleStatus = 'idle';
      state.createRoleSuccess = '';
      state.createRoleError = '';
    },

    clearCreateUserStatus(state: IUserState) {
      state.createUserStatus = 'idle';
      state.createUserSuccess = '';
      state.createUserError = '';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getUsersAction.pending, state => {
        state.getUsersStatus = 'loading';
      })
      .addCase(getUsersAction.fulfilled, (state, action) => {
        state.getUsersStatus = 'completed';
        state.getUsersSuccess = action.payload.message;
        state.users = action.payload.results as IUser[];
      })
      .addCase(getUsersAction.rejected, (state, action) => {
        state.getUsersStatus = 'failed';

        if (action.payload) {
          state.getUsersError = action.payload.message;
        } else state.getUsersError = action.error.message;
      });

    builder
      .addCase(getUserAction.pending, state => {
        state.getUserStatus = 'loading';
      })
      .addCase(getUserAction.fulfilled, (state, action) => {
        state.getUserStatus = 'completed';
        state.getUserSuccess = action.payload.message;
        state.user = action.payload.result as IUser;
      })
      .addCase(getUserAction.rejected, (state, action) => {
        state.getUserStatus = 'failed';

        if (action.payload) {
          state.getUserError = action.payload.message;
        } else state.getUserError = action.error.message;
      });

    builder
      .addCase(getPermissionsActions.pending, state => {
        state.getPermissionsStatus = 'loading';
      })
      .addCase(getPermissionsActions.fulfilled, (state, action) => {
        state.getPermissionsStatus = 'completed';
        state.getPermissionsSuccess = action.payload.message;
        state.permissions = action.payload.results as IPermission[];
      })
      .addCase(getPermissionsActions.rejected, (state, action) => {
        state.getPermissionsStatus = 'failed';

        if (action.payload) {
          state.getPermissionsError = action.payload.message;
        } else state.getPermissionsError = action.error.message;
      });

    builder
      .addCase(getRoleActions.pending, state => {
        state.getRolesStatus = 'loading';
      })
      .addCase(getRoleActions.fulfilled, (state, action) => {
        state.getRolesStatus = 'completed';
        state.getRolesSuccess = action.payload.message;
        state.roles = action.payload.results as IRole[];
      })
      .addCase(getRoleActions.rejected, (state, action) => {
        state.getRolesStatus = 'failed';

        if (action.payload) {
          state.getRolesError = action.payload.message;
        } else state.getRolesError = action.error.message;
      });

    builder
      .addCase(createRoleAction.pending, state => {
        state.createRoleStatus = 'loading';
      })
      .addCase(createRoleAction.fulfilled, (state, action) => {
        state.createRoleStatus = 'completed';
        state.createRoleSuccess = action.payload.message;
        state.role = action.payload.result as IRole;
      })
      .addCase(createRoleAction.rejected, (state, action) => {
        state.createRoleStatus = 'failed';

        if (action.payload) {
          state.createRoleError = action.payload.message;
        } else state.createRoleError = action.error.message;
      });

    builder
      .addCase(updateRoleAction.pending, state => {
        state.createRoleStatus = 'loading';
      })
      .addCase(updateRoleAction.fulfilled, (state, action) => {
        state.createRoleStatus = 'completed';
        state.createRoleSuccess = action.payload.message;
        state.role = action.payload.result as IRole;
      })
      .addCase(updateRoleAction.rejected, (state, action) => {
        state.createRoleStatus = 'failed';

        if (action.payload) {
          state.createRoleError = action.payload.message;
        } else state.createRoleError = action.error.message;
      });

    builder
      .addCase(createUserAction.pending, state => {
        state.createUserStatus = 'loading';
      })
      .addCase(createUserAction.fulfilled, (state, action) => {
        state.createUserStatus = 'completed';
        state.createUserSuccess = action.payload.message;
        state.user = action.payload.result as IUser;
      })
      .addCase(createUserAction.rejected, (state, action) => {
        state.createUserStatus = 'failed';

        if (action.payload) {
          state.createUserError = action.payload.message;
        } else state.createUserError = action.error.message;
      });

    builder
      .addCase(updateUserAction.pending, state => {
        state.createUserStatus = 'loading';
      })
      .addCase(updateUserAction.fulfilled, (state, action) => {
        state.createUserStatus = 'completed';
        state.createUserSuccess = action.payload.message;
        state.user = action.payload.result as IUser;
      })
      .addCase(updateUserAction.rejected, (state, action) => {
        state.createUserStatus = 'failed';

        if (action.payload) {
          state.createUserError = action.payload.message;
        } else state.createUserError = action.error.message;
      });

    builder
      .addCase(updateUserStatusAction.pending, state => {
        state.createUserStatus = 'loading';
      })
      .addCase(updateUserStatusAction.fulfilled, (state, action) => {
        state.createUserStatus = 'completed';
        state.createUserSuccess = action.payload.message;
        state.user = action.payload.result as IUser;
      })
      .addCase(updateUserStatusAction.rejected, (state, action) => {
        state.createUserStatus = 'failed';

        if (action.payload) {
          state.createUserError = action.payload.message;
        } else state.createUserError = action.error.message;
      });
  },
});

export const { clearGetUsersStatus, clearGetUserStatus, clearCreateRoleStatus, clearCreateUserStatus } =
  userSlice.actions;
export default userSlice.reducer;
