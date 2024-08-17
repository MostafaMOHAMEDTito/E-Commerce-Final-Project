import Joi from "joi";

export const orderValidation = Joi.object({
  code: Joi.string().required().label('Coupon Code'),
  expire: Joi.date().required().label('Expiration Date'),
  discount: Joi.number().required().min(0).max(100).label('Discount Percentage'),
  })

