import {
  createUserHandler,
  deleteUserHandler,
  getUserHandler,
  getUsersHandler,
  updateUsersHandler,
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
    path: '/user/:userId',
    handler: getUserHandler,
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
