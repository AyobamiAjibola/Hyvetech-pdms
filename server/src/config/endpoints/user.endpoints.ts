import {
  createPartnerUserHandler,
  createUserHandler,
  deleteUserHandler,
  getUserHandler,
  getUsersHandler,
  updateUserCreatedByPartnerHandler,
  updateUsersHandler,
  updateUserStatusHandler,
} from '../../routes/userRoute';
import { appCommonTypes } from '../../@types/app-common';
import RouteEndpoints = appCommonTypes.RouteEndpoints;

const userEndpoints: RouteEndpoints = [
  {
    name: 'users',
    method: 'get',
    path: '/users',
    handler: getUsersHandler,
  },
  {
    name: 'users',
    method: 'get',
    path: '/users/:userId',
    handler: getUserHandler,
  },
  {
    name: 'users',
    method: 'put',
    path: '/user/:userId/toggle-status',
    handler: updateUserStatusHandler,
  },

  {
    name: 'users',
    method: 'post',
    path: '/user',
    handler: createUserHandler,
  },

  {
    name: 'users',
    method: 'put',
    path: '/user',
    handler: updateUsersHandler,
  },
  {
    name: 'users',
    method: 'delete',
    path: '/user/:id',
    handler: deleteUserHandler,
  },
  {
    name: 'create user by partner',
    method: 'post',
    path: '/create-user-by-partner',
    handler: createPartnerUserHandler,
  },
  {
    name: 'update user by partner',
    method: 'put',
    path: '/update-user-by-partner',
    handler: updateUserCreatedByPartnerHandler,
  },
  {
    name: 'delete user',
    method: 'delete',
    path: '/delete-user/:id',
    handler: deleteUserHandler,
  },
];

export default userEndpoints;
