import express, { json, static as _static } from "express";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import swaggerJsdoc from "swagger-jsdoc";
import { serve, setup } from "swagger-ui-express";

import settings from "./config/settings";
import globalExceptionHandler from "./middleware/globalExceptionHandler";
import config from "./config";
import authenticateRoute from "./middleware/authenticateRoute";
import router from "./routes";
import helmet from "helmet";
import fileUploadMiddleware from "./middleware/fileUploadMiddleware";
import { UPLOAD_BASE_PATH } from "./config/constants";
import bodyParser from "body-parser";

const app = express();

const openapiSpecification = swaggerJsdoc(config.swagger); //configure swagger API documentation
const corsOptions = {
  origin: [
    settings.client.host,
    settings.client.ip,
    settings.customer.host,
    settings.customer.ip,
  ],
  credentials: true,
};

app.use(helmet());
app.use(cors(corsOptions)); //handle cors operations
app.use(json()); // Parse incoming requests data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev")); //Route debugger

app.use("/uploads", authenticateRoute, _static(path.resolve("uploads")));

// Route API documentation
app.use(`${settings.service.apiRoot}/docs`, serve, setup(openapiSpecification));

app.use(fileUploadMiddleware({ uploadDir: UPLOAD_BASE_PATH }));

app.use(`${settings.service.apiRoot}`, router); //All routes middleware

app.use(globalExceptionHandler); //Handle error globally

export default app;
