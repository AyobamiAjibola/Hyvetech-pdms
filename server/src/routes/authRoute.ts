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

  // res.cookie(settings.cookie.refreshToken, response.tokens?.refreshToken, {
  //   // sameSite: "none",
  //   // secure: false,
  //   // signed: true,
  //   // httpOnly: true,
  //   httpOnly: true,
  //   maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  //   path: '/',
  //   signed: true,
  //   domain: 'localhost',
  //   expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Set expiration to 24 hours from now
  //   sameSite: 'none'
  // });

  // res.cookie(settings.cookie.accessToken, response.tokens?.accessToken, {
  //   // sameSite: "none",
  //   // secure: false,
  //   // signed: true,
  //   // httpOnly: true,
  //   httpOnly: true,
  //   maxAge: 20 * 60 * 1000, // 20 minutes in milliseconds
  //   path: '/',
  //   signed: true,
  //   domain: 'localhost',
  //   expires: new Date(Date.now() + 20 * 60 * 1000), // Set expiration to 20 minutes from now
  //   sameSite: 'none'
  // });

  res.status(response.code).json(response);
};

export const checkAuthHandler = async (req: Request, res: Response) => {
  const response = await authenticationController.checkAuth(req, res);

  res.status(response?.code as number).json(response);
}

export const bootstrapHandler = async (req: Request, res: Response) => {
  const response = await authenticationController.bootstrap();

  res.status(response.code).json(response);
};

export const signOutHandler = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const response = await authenticationController.signOut(req, res);

    res.clearCookie(settings.cookie.accessToken, {
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

export const resetToken = async (req: Request, res: Response) => {
  const response = await authenticationController.resetTOken(req);
  res.status(response.code).json(response);
};


export const changePasswordHandler = authenticateRouteWrapper( async (req: Request, res: Response) => {
  const response = await authenticationController.changePassword(req);
  res.status(response.code).json(response);
});

export const preSignUpHandler = async (req: Request, res: Response) => {
  const response = await authenticationController.preSignUp(req);
  res.status(response.code).json(response);
};

export const verifyTokenHandler = async (req: Request, res: Response) => {
  const response = await authenticationController.verifyToken(req);
  res.status(response.code).json(response);
};


