import express, { json, static as _static } from 'express';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import swaggerJsdoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';
import cookieParser from 'cookie-parser';

import settings from './config/settings';
import globalExceptionHandler from './middleware/globalExceptionHandler';
import config from './config';

import router from './routes';


const app = express();
const openapiSpecification = swaggerJsdoc(config.swagger); //configure swagger API documentation
export const corsOptions = {
  origin: [
    'http://localhost:3000',
    <string>process.env.CLIENT_HOST,
    <string>process.env.CLIENT_HOST_WWW,
    <string>process.env.CLIENT_IP,
    <string>process.env.CUSTOMER_APP_HOST,
    <string>process.env.CUSTOMER_APP_HOST_WWW,
    <string>process.env.CUSTOMER_APP_IP,
    <string>process.env.WEBSITE_HOST,
    <string>process.env.WEBSITE_HOST_WWW,
    <string>process.env.WEBSITE_IP,
    <string>process.env.PARTNER_HOST,
    <string>process.env.PARTNER_WWW,
  ],
  credentials: true,
};

app.use(helmet());
app.use(cookieParser(settings.cookie.secret));
app.use(cors(corsOptions)); //handle cors operations
// app.use(cors()); //handle cors operations
app.use(json()); // Parse incoming requests data
app.use(morgan('dev')); //Route debugger

app.use('/uploads', _static(path.resolve('uploads')));

// Route API documentation
app.use(`${settings.service.apiRoot}/docs`, serve, setup(openapiSpecification));

app.use(`${settings.service.apiRoot}`, router); //All routes middleware

app.use(globalExceptionHandler); //Handle error globally

export default app;
