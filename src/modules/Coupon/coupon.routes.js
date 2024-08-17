import { Router } from "express";
import * as couponRouter from "./controller/coupon.controller.js";
import asyncHandler from "../../middleware/asyncHandler.js";
import validation from "../../middleware/validation.js";
import { authentication } from "../../middleware/authentication.js";
import authorization from "../../middleware/authorization.js";
import roles from "../../Types/roles.js";
import { couponValidation } from "./coupon.validation.js";
const router = Router();

router
  .get(
    "/",
    authentication,
    authorization([roles.admin]),
    asyncHandler(couponRouter.getCoupons)
  )
  .get(
    "/:id",
    authentication,
    authorization([roles.admin, roles.user]),
    asyncHandler(couponRouter.getCoupon)
  )
  .post(
    "/",
    validation(couponValidation),
    authentication,
    authorization([roles.admin]),
    asyncHandler(couponRouter.addCoupon)
  )
  .delete(
    "/:id",
    authentication,
    authorization([roles.admin]),
    asyncHandler(couponRouter.deleteCoupon)
  );
export default router;
