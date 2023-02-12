"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.garageSignUpHandler = exports.signOutHandler = exports.bootstrapHandler = exports.signInHandler = exports.signupHandler = void 0;
const AuthenticationController_1 = __importDefault(require("../controllers/AuthenticationController"));
const PasswordEncoder_1 = __importDefault(require("../utils/PasswordEncoder"));
const authenticateRouteWrapper_1 = __importDefault(require("../middleware/authenticateRouteWrapper"));
const settings_1 = __importDefault(require("../config/settings"));
const passwordEncoder = new PasswordEncoder_1.default();
const authenticationController = new AuthenticationController_1.default(passwordEncoder);
/**
 * @swagger
 * /api/v1/sign-up:
 *  post:
 *   description: Sign up new user
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/SignUp'
 *   responses:
 *    200:
 *     description: OK
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/definitions/SignUpSuccessResponse'
 *    400:
 *     description: Bad requests
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/definitions/ErrorResponse'
 *    401:
 *     description: Unauthorized
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/definitions/ErrorResponse'
 */
const signupHandler = async (req, res) => {
    const response = await authenticationController.signup(req);
    res.status(response.code).json(response);
};
exports.signupHandler = signupHandler;
/**
 * @swagger
 * /api/v1/sign-in:
 *  post:
 *   description: Sign in to the application and generate JWT
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/SignIn'
 *   responses:
 *    200:
 *     description: OK
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/definitions/SignIn'
 *    400:
 *     description: Bad requests
 *     content:
 *      application/json:
 *       schema:
 *         $ref: '#/definitions/ErrorResponse'
 *    401:
 *     description: Unauthorized
 *     content:
 *       application/json:
 *        schema:
 *          $ref: '#/definitions/ErrorResponse'
 */
const signInHandler = async (req, res) => {
    const response = await authenticationController.signIn(req);
    res.cookie(settings_1.default.cookie.name, response.result, {
        sameSite: 'none',
        secure: true,
        signed: true,
        httpOnly: true,
    });
    res.status(response.code).json(response);
};
exports.signInHandler = signInHandler;
const bootstrapHandler = async (req, res) => {
    const response = await authenticationController.bootstrap();
    res.status(response.code).json(response);
};
exports.bootstrapHandler = bootstrapHandler;
exports.signOutHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await authenticationController.signOut(req);
    res.clearCookie(settings_1.default.cookie.name, {
        sameSite: 'none',
        secure: true,
        signed: true,
        httpOnly: true,
    });
    res.status(response.code).json(response);
});
const garageSignUpHandler = async (req, res) => {
    const response = await authenticationController.garageSignup(req);
    res.status(response.code).json(response);
};
exports.garageSignUpHandler = garageSignUpHandler;
