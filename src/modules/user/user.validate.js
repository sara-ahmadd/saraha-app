import joi from "joi";
import { genders } from "../../DB/models/user.model.js";

export const profileSchema = joi.object({
  userName: joi.string().min(3).messages({
    "string.base": "Username must be a string.",
    "string.min": "Username must be at least 3 characters long.",
  }),
  phone: joi.string().messages({
    "string.base": "Phone number must be a string.",
  }),
  email: joi.string().email().messages({
    "string.base": "Email must be a string.",
    "string.email": "Please provide a valid email address.",
  }),
  gender: joi
    .string()
    .valid(...Object.values(genders))
    .default(genders.male)
    .messages({
      "string.base": "Gender must be a string.",
      "any.only": "Gender must be one of the allowed values.",
    }),
});

export const changePasswordSchema = joi
  .object({
    oldPassword: joi.string().required().min(6).messages({
      "string.base": "Password must be a string.",
      "string.min": "Password must be at least 6 characters long.",
      "any.required": "Old Password is required.",
    }),
    newPassword: joi.string().required().min(6).messages({
      "string.base": "Password must be a string.",
      "string.min": "Password must be at least 6 characters long.",
      "any.required": "New Password is required.",
    }),
    confirmPassword: joi
      .string()
      .valid(joi.ref("newPassword"))
      .required()
      .messages({
        "any.only": "Passwords do not match.",
        "any.required": "Confirm Password is required.",
      }),
  })
  .required();
