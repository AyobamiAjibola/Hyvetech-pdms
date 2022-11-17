import 'dotenv/config';
import * as http from 'http';
import supertest, { SuperTest, Test } from 'supertest';
import immer from 'immer';

import app from '../../src/app';
import database from '../../src/config/database';
import settings from '../../src/config/settings';
import HttpStatus from '../../src/helpers/HttpStatus';
import CommandLineRunner from '../../src/helpers/CommandLineRunner';
import RoleRepository from '../../src/repositories/RoleRepository';
import UserRepository from '../../src/repositories/UserRepository';
import PasswordEncoder from '../../src/utils/PasswordEncoder';
import Role from '../../src/models/Role';
import { InferAttributes } from 'sequelize';
import User from '../../src/models/User';

const port = 5000;
const apiRoot = settings.service.apiRoot;

let server: http.Server, request: SuperTest<Test>;

const userObject: any = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'johnDoe@gmail.com',
  phone: '08068337414',
  password: 'W3lc0m3@123',
  confirmPassword: 'W3lc0m3@123',
  username: 'johnDoe',
};

const createUserObject = {
  ...userObject,
  role: 'USER_ROLE',
};

const loginObject = {
  username: 'johnDoe',
  password: userObject.password,
};

const createUser = async () => {
  const userRepository = new UserRepository();
  const roleRepository = new RoleRepository();
  const encoder = new PasswordEncoder();
  const role = await roleRepository.findOne({
    where: { slug: createUserObject.role },
  });

  console.log(await roleRepository.findAll());

  userObject.password = await encoder.encode(userObject.password);

  const user = await userRepository.save(userObject);
  await user.$set('roles', [<Role>role]);

  return user;
};

describe('AuthenticationController', () => {
  beforeAll(async () => {
    await database.init();
    await database.sequelize.sync({ force: true });

    await CommandLineRunner.run();

    request = supertest(app);
    server = http.createServer(app);

    server.listen(port);
  });

  afterAll(async () => {
    await database.sequelize.close();
    server.close();
  });

  describe('/post sign up new user', () => {
    afterAll(async () => {
      await database.sequelize.sync({ force: true });
    });

    it('should return status 400 given invalid user object, when user does not exist', async () => {
      const data = immer(createUserObject, (draft: InferAttributes<User>) => ({
        ...draft,
        firstName: '',
      }));

      const response = await request.post(`${apiRoot}/sign-up`).send(data);

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST.code);
    });

    it('should return status 404 given valid user object, when role does not exist', async () => {
      const data = immer(createUserObject, (draft: InferAttributes<User>) => ({
        ...draft,
        role: 'some_role',
      }));

      const response = await request.post(`${apiRoot}/sign-up`).send(data);

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND.code);
      expect(response.body.message).toBe(HttpStatus.NOT_FOUND.value);
    });

    it('should return status 200 given valid user object, when user does not exist', async () => {
      const response = await request.post(`${apiRoot}/sign-up`).send(createUserObject);

      expect(response.statusCode).toBe(HttpStatus.OK.code);
      expect(response.body.result).toHaveProperty('firstName', createUserObject.firstName);
    });
  });

  describe('/post sign in user', () => {
    afterAll(async () => {
      await database.sequelize.sync({ force: true });
    });

    it('should return status 400 given invalid authentication object, when user does not exist', async () => {
      const data = immer(loginObject, draft => ({
        ...draft,
        username: '',
      }));

      const response = await request.post(`${apiRoot}/sign-in`).send(data);

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST.code);
    });

    it('should return status 401 given valid authentication object, when user does not exist', async () => {
      const response = await request.post(`${apiRoot}/sign-in`).send(loginObject);

      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED.code);
      expect(response.body.message).toBe(HttpStatus.UNAUTHORIZED.value);
    });

    it('should return status 401 given invalid password, when user exist', async () => {
      //create user
      await createUser();

      const data = immer(loginObject, draft => ({
        ...draft,
        password: 'P@sswrd123',
      }));

      const response = await request.post(`${apiRoot}/sign-in`).send(data);

      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED.code);
      expect(response.body.message).toBe(HttpStatus.UNAUTHORIZED.value);
    });

    it('should return status 200, given valid username and password, when user exist', async () => {
      //create user
      await createUser();

      const response = await request.post(`${apiRoot}/sign-in`).send(loginObject);

      expect(response.statusCode).toBe(HttpStatus.OK.code);
      expect(response.body.message).toBe('Login successful');
    });
  });
});
