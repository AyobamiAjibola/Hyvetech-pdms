import {
  createUserHandler,
  deleteUserHandler,
  getUserHandler,
  getUsersHandler,
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
];

export default userEndpoints;
