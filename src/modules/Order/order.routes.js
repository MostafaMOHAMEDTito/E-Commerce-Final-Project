import { Router } from "express";
import * as orderRouter from "./controller/order.controller.js";
import asyncHandler from "../../middleware/asyncHandler.js";
import validation from "../../middleware/validation.js";
import { authentication } from "../../middleware/authentication.js";
import authorization from "../../middleware/authorization.js";
import roles from "../../Types/roles.js";
import { orderValidation } from "./order.validation.js";
const router = Router();

router
  .get(
    "/",
    authentication,
    authorization([roles.admin]),
    asyncHandler(orderRouter.getOrders)
  )
  .get(
    "/:id",
    authentication,
    authorization([roles.admin, roles.user]),
    asyncHandler(orderRouter.getOrder)
  )
  .post(
    "/",
    // validation(orderValidation),
    authentication,
    authorization([roles.admin]),
    asyncHandler(orderRouter.addOrder)
  )
  .delete(
    "/:id",
    authentication,
    authorization([roles.admin]),
    asyncHandler(orderRouter.deleteOrder)
  );
export default router;
