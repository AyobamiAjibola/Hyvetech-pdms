import jwt, { JwtPayload } from 'jsonwebtoken';
import _ from 'lodash';

import moment from 'moment';

export type CustomJWTPayload = JwtPayload & { exp: number };

const cookie = {
  clear(cookies: string) {
    if (!_.isArray(cookies) && cookies.length === 0) return false;

    for (let i = 0; i < cookies.length; i++) {
      this.remove(cookies[i]);
    }
    return true;
  },

  exist(name: string) {
    return this.get(name).length !== 0;
  },

  isExpired(name: string) {
    const cookie = this.get(name);

    if (!cookie.length) return true;

    const decode = <CustomJWTPayload>jwt.decode(cookie);

    if (!decode) throw new Error('Could not decode JWT');

    const cookieExpiry = decode.exp;

    const date = new Date(cookieExpiry * 1000);

    const cookieDate = moment(date.toUTCString());

    const now = moment();

    return now.isAfter(cookieDate);
  },

  set(name: string, value: string) {
    const decode = <CustomJWTPayload>jwt.decode(value);

    if (!decode) throw new Error('Could not decode JWT');

    const exp = decode.exp;

    const date = new Date(exp * 1000);

    document.cookie = `${name}=${value};Expires=${date.toUTCString()};Path=/;SameSite=strict;`;
  },

  get(name: string) {
    name = name + '=';

    const ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }

      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }

    return '';
  },

  remove(name: string) {
    return (document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`);
  },
};

export default cookie;
