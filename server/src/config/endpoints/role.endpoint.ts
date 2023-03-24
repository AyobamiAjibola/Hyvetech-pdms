import { dashboardHandler } from '../../routes/dashboardRoute';
import { appCommonTypes } from '../../@types/app-common';
import RouteEndpoints = appCommonTypes.RouteEndpoints;
import { createRole, getAllPermissions, getAllRole, getSingleRole, updateRole } from '../../routes/roleHandler';

const roleEndpoints: RouteEndpoints = [
  {
    name: 'role',
    method: 'get',
    path: '/roles',
    handler: getAllRole,
  },
  {
    name: 'role',
    method: 'post',
    path: '/role',
    handler: createRole,
  },

  {
    name: 'role',
    method: 'get',
    path: '/permissions',
    handler: getAllPermissions,
  },
  {
    name: 'role',
    method: 'get',
    path: '/role/:id',
    handler: getSingleRole,
  },
  {
    name: 'role',
    method: 'patch',
    path: '/role',
    handler: updateRole,
  },
];
export default roleEndpoints;
