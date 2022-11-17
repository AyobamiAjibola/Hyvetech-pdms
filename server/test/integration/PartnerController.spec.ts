import 'dotenv/config';
import * as http from 'http';
import supertest, { SuperTest, Test } from 'supertest';
import settings from '../../src/config/settings';
import app from '../../src/app';
import database from '../../src/config/database';

const port = 5060;
const apiRoot = settings.service.apiRoot;

let httpServer: http.Server, request: SuperTest<Test>;

describe('PartnerController', function () {
  beforeAll(async () => {
    request = supertest(app);
    httpServer = http.createServer(app);

    await database.init();
    await database.sequelize.sync();

    httpServer.listen(port);
  });

  afterAll(async () => {
    await database.sequelize.close();
    httpServer.close();
  });

  describe('Add Payment Payment Plans', function () {
    it('should create payment plan and return 200', async function () {
      const response = await request.post(`${apiRoot}/partners/1/payment-plans`);

      console.log(response);
    });
  });
});
