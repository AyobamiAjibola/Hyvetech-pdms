import { Request, Response } from "express";
import AuthenticationController from "../controllers/AuthenticationController";
import PasswordEncoder from "../utils/PasswordEncoder";
import authenticateRouteWrapper from "../middleware/authenticateRouteWrapper";
import settings from "../config/settings";

const passwordEncoder = new PasswordEncoder();
const authenticationController = new AuthenticationController(passwordEncoder);

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
export const signupHandler = async (req: Request, res: Response) => {
  const response = await authenticationController.signup(req);

  res.status(response.code).json(response);
};

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
export const signInHandler = async (req: Request, res: Response) => {
  const response = await authenticationController.signIn(req);

  res.cookie(settings.cookie.name, response.result, {
    sameSite: "none",
    secure: true,
    signed: true,
    httpOnly: true,
  });

  res.status(response.code).json(response);
};

export const bootstrapHandler = async (req: Request, res: Response) => {
  const response = await authenticationController.bootstrap();

  res.status(response.code).json(response);
};

export const signOutHandler = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const response = await authenticationController.signOut(req);

    res.clearCookie(settings.cookie.name, {
      sameSite: "none",
      secure: true,
      signed: true,
      httpOnly: true,
    });

    res.status(response.code).json(response);
  }
);

export const garageSignUpHandler = async (req: Request, res: Response) => {
  const response = await authenticationController.garageSignup(req);

  res.status(response.code).json(response);
};

export const sendPasswordResetToken = async (req: Request, res: Response) => {
  const response = await authenticationController.sendPasswordResetToken(req);
  res.status(response.code).json(response);
};

export const resetPasswordWithToken = async (req: Request, res: Response) => {
  const response = await authenticationController.resetPasswordWithTOken(req);
  res.status(response.code).json(response);
};
