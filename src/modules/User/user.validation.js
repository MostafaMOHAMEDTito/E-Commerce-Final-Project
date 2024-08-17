import Joi from "joi";
import roles from "../../Types/roles.js";

export const userValidationSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(15)
    .trim()
    .required()
    .messages({
      "string.min": "Username must be at least 3 characters long",
      "string.max": "Username must be at most 15 characters long",
      "any.required": "Username is required",
    }),

  email: Joi.string()
    .email()
    .required()
    .trim()
    .lowercase()
    .messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .min(5) 
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required",
    }),

  role: Joi.string()
    .valid(...Object.values(roles))
    .default(roles.user)
    .messages({
      "any.only": "Role must be one of the following: " + Object.values(roles).join(", "),
    }),

  status: Joi.string()
    .valid("online", "offline")
    .default("offline")
    .messages({
      "any.only": "Status must be either 'online' or 'offline'",
    }),

  resetPasswordOTP: Joi.string().optional(),
  resetPasswordExpires: Joi.date().optional(),
});

export default userValidationSchema;
