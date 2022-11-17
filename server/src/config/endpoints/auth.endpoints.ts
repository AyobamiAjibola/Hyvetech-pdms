import { bootstrapHandler, signInHandler, signOutHandler, signupHandler } from '../../routes/authRoute';
import { appCommonTypes } from '../../@types/app-common';
import RouteEndpoints = appCommonTypes.RouteEndpoints;

const authEndpoints: RouteEndpoints = [
  {
    name: 'signIn',
    method: 'post',
    path: '/sign-in',
    handler: signInHandler,
  },
  {
    name: 'signUp',
    method: 'post',
    path: '/sign-up',
    handler: signupHandler,
  },
  {
    name: 'signOut',
    method: 'get',
    path: '/sign-out',
    handler: signOutHandler,
  },
  {
    name: 'bootstrap',
    method: 'get',
    path: '/bootstrap',
    handler: bootstrapHandler,
  },
];

export default authEndpoints;
