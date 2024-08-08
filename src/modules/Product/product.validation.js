import Joi from "joi";

export const productValidation = Joi.object({
  title: Joi.string().min(3).max(150).trim().required(),
  desc: Joi.string().required(),
  price: Joi.number().min(0).required(),
  priceAfterDiscount: Joi.number().min(0).optional(),
  stock: Joi.number().min(0).required(),
  sold: Joi.number().min(0).optional(),
  rateAverage: Joi.number().min(0).max(5).optional(),
  rateCount: Joi.number().min(0).optional(),
  mainImage: Joi.array()
    .items({
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
    })
    .optional(),
  coverImage: Joi.array()
    .items({
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
    })
    .optional(),
  createdBy: Joi.string().optional(),
  updatedBy: Joi.string().optional(),
  category: Joi.string().required(),
  subCategory: Joi.string().required(),
  brand: Joi.string().required(),
}).required();
