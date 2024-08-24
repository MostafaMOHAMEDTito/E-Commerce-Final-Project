import Joi from "joi";

export const orderValidation = Joi.object({
  address: Joi.string().required().label('address'),
  phone: Joi.string().required()
});