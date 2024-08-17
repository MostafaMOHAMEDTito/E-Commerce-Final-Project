import { Router } from "express";
import * as productRouter from "./controller/product.controller.js";
import asyncHandler from "../../middleware/asyncHandler.js";
import upload from "../../middleware/upload.js";
import { productValidation } from "./product.validation.js";
import validation from "../../middleware/validation.js";
import { authentication } from "../../middleware/authentication.js";
import authorization from "../../middleware/authorization.js";
import roles from "../../Types/roles.js";
const router = Router();

router
  .get(
    "/",
    authentication,
    authorization([roles.admin]),
    asyncHandler(productRouter.getProducts)
  )
  .get(
    "/:id",
    authentication,
    authorization([roles.admin]),
    asyncHandler(productRouter.getProduct)
  )
  .post(
    "/",
    upload("product").fields([
      { name: "mainImage", maxCount: 1 },
      { name: "coverImage", maxCount: 5 },
    ]),
    validation(productValidation),
    authentication,
    authorization([roles.admin]),
    asyncHandler(productRouter.addProduct)
  )
  .put(
    "/:id",
    upload("product").fields([
      { name: "mainImage", maxCount: 1 },
      { name: "coverImage", maxCount: 5 },
    ]),
    authentication,
    authorization([roles.admin]),
    asyncHandler(productRouter.updateProduct)
  )
  .delete(
    "/:id",
    authentication,
    authorization([roles.admin]),
    asyncHandler(productRouter.deleteProduct)
  );

export default router;
