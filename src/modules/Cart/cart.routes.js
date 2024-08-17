import { Router } from "express";
import * as cartRouter from "./controller/cart.controller.js";
import asyncHandler from "../../middleware/asyncHandler.js";
import validation from "../../middleware/validation.js";
import { authentication } from "../../middleware/authentication.js";
import authorization from "../../middleware/authorization.js";
import roles from "../../Types/roles.js";
import { cartValidation } from "./cart.validation.js";
const router = Router();

router
  .get(
    "/",
    authentication,
    authorization([roles.admin]),
    asyncHandler(cartRouter.getCarts)
  )
  .get(
    "/user",
    authentication,
    authorization([roles.admin, roles.user]),
    asyncHandler(cartRouter.getUserCart)
  )
  .post(
    "/",
    validation(cartValidation),
    authentication,
    authorization([roles.admin, roles.user]),
    asyncHandler(cartRouter.addCart)
  )
  .post(
    "/coupon",
    authentication,
    authorization([roles.admin, roles.user]),
    asyncHandler(cartRouter.applyCoupon)
  )
  .patch(
    "/:id",
    authentication,
    authorization([roles.admin, roles.user]),
    asyncHandler(cartRouter.deleteProductCart)
  )
  .put(
    "/",
    authentication,
    authorization([roles.admin, roles.user]),
    asyncHandler(cartRouter.updateQuantityforProductINCart)
  )
  .delete(
    "/:id",
    authentication,
    authorization([roles.admin]),
    asyncHandler(cartRouter.deleteCart)
  );
export default router;
