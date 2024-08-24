import Joi from "joi";
import { Types } from "mongoose";

export const cartValidation = Joi.object({
  product: Joi.string().custom((value, helpers) => {
    if (!Types.ObjectId.isValid(value)) {
      return helpers.message("Invalid product ID");
    }
    return value;
  }),
  quantity: Joi.number().integer().min(1),
  price: Joi.number().min(1),
});
