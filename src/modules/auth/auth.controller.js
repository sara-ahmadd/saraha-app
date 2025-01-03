import Router from "express";
import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import { UserModel } from "../../DB/models/user.model.js";
import {
  activateAcountService,
  forgotPasswordService,
  loginService,
  resetPasswordService,
  signUpService,
} from "./auth.service.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  activationSchema,
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from "./auth.validate.js";
import { isAuthenticated } from "../../middlewares/authenticate.middleare.js";

const router = Router();

//signup
router.post("/signup", validate(signupSchema), asyncHandler(signUpService));

//login
router.post("/login", validate(loginSchema), asyncHandler(loginService));

//activate account
router.get(
  "/activate/:token",
  validate(activationSchema),
  asyncHandler(activateAcountService)
);

//forgot password
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  asyncHandler(forgotPasswordService)
);

//reset password
router.post(
  "/reset-password/:token",
  validate(resetPasswordSchema),
  asyncHandler(resetPasswordService)
);

export default router;
