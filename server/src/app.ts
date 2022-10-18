import express, { json, static as _static } from "express";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import swaggerJsdoc from "swagger-jsdoc";
import { serve, setup } from "swagger-ui-express";
import bodyParser from "body-parser";

import settings from "./config/settings";
import globalExceptionHandler from "./middleware/globalExceptionHandler";
import config from "./config";

import router from "./routes";
import fileUploadMiddleware from "./middleware/fileUploadMiddleware";
import { UPLOAD_BASE_PATH } from "./config/constants";

const app = express();
const openapiSpecification = swaggerJsdoc(config.swagger); //configure swagger API documentation
export const corsOptions = {
  origin: [
    <string>process.env.CLIENT_HOST,
    <string>process.env.CLIENT_HOST_WWW,
    <string>process.env.CLIENT_IP,
    <string>process.env.CUSTOMER_APP_HOST,
    <string>process.env.CUSTOMER_APP_HOST_WWW,
    <string>process.env.CUSTOMER_APP_IP,
    <string>process.env.WEBSITE_HOST,
    <string>process.env.WEBSITE_HOST_WWW,
    <string>process.env.WEBSITE_IP,
  ],
  credentials: true,
};

app.use(helmet());
app.use(cors(corsOptions)); //handle cors operations
app.use(json()); // Parse incoming requests data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev")); //Route debugger

app.use("/uploads", _static(path.resolve("uploads")));

// Route API documentation
app.use(`${settings.service.apiRoot}/docs`, serve, setup(openapiSpecification));

app.use(fileUploadMiddleware({ uploadDir: UPLOAD_BASE_PATH }));

app.use(`${settings.service.apiRoot}`, router); //All routes middleware

app.use(globalExceptionHandler); //Handle error globally

export default app;
