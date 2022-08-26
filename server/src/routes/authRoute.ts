import { Request, Response } from "express";
import AuthenticationController from "../controllers/AuthenticationController";

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
  const response = await AuthenticationController.signup(req);

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
  const response = await AuthenticationController.signIn(req);

  res.status(response.code).json(response);
};
