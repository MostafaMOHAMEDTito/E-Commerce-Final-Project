import Joi from "joi";

export const addBrandValidation = Joi.object({
  name: Joi.string().min(3).max(30).trim().required(),
  file: Joi.object({
    filename: Joi.string().required(),
    fieldname: Joi.string().required(),
    encoding: Joi.string().required(),
    destination: Joi.string().required(),
    path: Joi.string().required(),
    mimetype: Joi.string()
      .valid("image/jpeg", "image/png", "image/gif")
      .required()
      .messages({
        "any.required": "File is required",
        "string.valid": "File type must be either jpeg, png, or gif",
      }),
    originalname: Joi.string().required(),
    size: Joi.number().positive().required(),
  }),
}).required();
