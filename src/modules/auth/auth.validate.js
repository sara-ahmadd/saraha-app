import joi from "joi";
import { genders } from "../../DB/models/user.model.js";

export const signupSchema = joi
  .object({
    userName: joi.string().required().min(3).messages({
      "string.base": "Username must be a string.",
      "string.empty": "Username is required.",
      "string.min": "Username must be at least 3 characters long.",
      "any.required": "Username is required.",
    }),
    phone: joi.string().required().messages({
      "string.base": "Phone number must be a string.",
      "string.empty": "Phone number is required.",
      "any.required": "Phone number is required.",
    }),
    email: joi.string().required().email().messages({
      "string.base": "Email must be a string.",
      "string.empty": "Email is required.",
      "string.email": "Please provide a valid email address.",
      "any.required": "Email is required.",
    }),
    password: joi.string().required().min(6).messages({
      "string.base": "Password must be a string.",
      "string.empty": "Password is required.",
      "string.min": "Password must be at least 6 characters long.",
      "any.required": "Password is required.",
    }),
    confirmPassword: joi
      .string()
      .required()
      .valid(joi.ref("password"))
      .messages({
        "any.only": "Passwords do not match.",
      }),
    isActivated: joi.boolean().default(false),
    gender: joi
      .string()
      .valid(...Object.values(genders))
      .default(genders.male)
      .messages({
        "string.base": "Gender must be a string.",
        "any.only": "Gender must be one of the allowed values.",
      }),
    isDeleted: joi.boolean().default(false),
  })
  .required();

export const loginSchema = joi
  .object({
    email: joi.string().required().email().messages({
      "string.base": "Email must be a string.",
      "string.empty": "Email is required.",
      "string.email": "Please provide a valid email address.",
      "any.required": "Email is required.",
    }),
    password: joi.string().required().min(6).messages({
      "string.base": "Password must be a string.",
      "string.empty": "Password is required.",
      "string.min": "Password must be at least 6 characters long.",
      "any.required": "Password is required.",
    }),
  })
  .required();

export const activationSchema = joi
  .object({
    email: joi.string().required().email().messages({
      "string.base": "Email must be a string.",
      "string.empty": "Email is required.",
      "string.email": "Please provide a valid email address.",
      "any.required": "Email is required.",
    }),
  })
  .required();
export const verifyEmailSchema = joi
  .object({
    email: joi.string().required().messages({
      "string.base": "Token must be a string.",
      "string.empty": "Token is required.",
      "any.required": "Token is required.",
    }),
    otp: joi.string().required().messages({
      "string.base": "otp must be a string.",
      "string.empty": "otp is required.",
      "any.required": "otp is required.",
    }),
  })
  .required();

export const forgotPasswordSchema = joi
  .object({
    email: joi.string().required().email().messages({
      "string.base": "Email must be a string.",
      "string.empty": "Email is required.",
      "string.email": "Please provide a valid email address.",
      "any.required": "Email is required.",
    }),
  })
  .required();

export const resetPasswordSchema = joi
  .object({
    token: joi.string().required().messages({
      "string.base": "Token must be a string.",
      "string.empty": "Token is required.",
      "any.required": "Token is required.",
    }),
    password: joi.string().required().min(6).messages({
      "string.base": "Password must be a string.",
      "string.empty": "Password is required.",
      "string.min": "Password must be at least 6 characters long.",
      "any.required": "Password is required.",
    }),
    confirmPassword: joi
      .string()
      .required()
      .valid(joi.ref("password"))
      .messages({
        "string.empty": "Confirm password is required.",
        "any.only": "Passwords do not match.",
      }),
  })
  .required();
