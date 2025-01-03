import joi from "joi";

export const sendMessageSchema = joi
  .object({
    content: joi.string().required().messages({
      "string.base": "Content must be a string.",
      "string.empty": "Content is required.",
      "string.min": "Content must be at least 3 characters long.",
      "any.required": "Content is required.",
    }),
    receiverEmail: joi.string().required().email().messages({
      "string.base": "receiverEmail must be a string.",
      "string.empty": "receiverEmail is required.",
      "string.email": "Please provide a valid email address.",
      "any.required": "receiverEmail is required.",
    }),
  })
  .required();
