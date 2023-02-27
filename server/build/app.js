"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const express_1 = __importStar(require("express"));
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = require("swagger-ui-express");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const settings_1 = __importDefault(require("./config/settings"));
const globalExceptionHandler_1 = __importDefault(require("./middleware/globalExceptionHandler"));
const config_1 = __importDefault(require("./config"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
const openapiSpecification = (0, swagger_jsdoc_1.default)(config_1.default.swagger); //configure swagger API documentation
exports.corsOptions = {
    origin: [
        process.env.CLIENT_HOST,
        process.env.CLIENT_HOST_WWW,
        process.env.CLIENT_IP,
        process.env.CUSTOMER_APP_HOST,
        process.env.CUSTOMER_APP_HOST_WWW,
        process.env.CUSTOMER_APP_IP,
        process.env.WEBSITE_HOST,
        process.env.WEBSITE_HOST_WWW,
        process.env.WEBSITE_IP,
        process.env.PARTNER_HOST,
        process.env.PARTNER_WWW,
    ],
    credentials: true,
};
app.use((0, helmet_1.default)());
app.use((0, cookie_parser_1.default)(settings_1.default.cookie.secret));
// app.use(cors(corsOptions)); //handle cors operations
app.use((0, cors_1.default)()); //handle cors operations
app.use((0, express_1.json)()); // Parse incoming requests data
app.use((0, morgan_1.default)('dev')); //Route debugger
app.use('/uploads', (0, express_1.static)(path_1.default.resolve('uploads')));
// Route API documentation
app.use(`${settings_1.default.service.apiRoot}/docs`, swagger_ui_express_1.serve, (0, swagger_ui_express_1.setup)(openapiSpecification));
app.use(`${settings_1.default.service.apiRoot}`, routes_1.default); //All routes middleware
app.use(globalExceptionHandler_1.default); //Handle error globally
exports.default = app;
