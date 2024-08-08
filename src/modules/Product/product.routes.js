import { Router } from "express";
import * as productRouter from "./controller/product.controller.js";
import asyncHandler from "../../middleware/asyncHandler.js";
import upload from "../../middleware/upload.js";
import { productValidation } from "./product.validation.js";
import validation from "../../middleware/validation.js";

const router = Router();

router
  .get("/", asyncHandler(productRouter.getProducts))
  .get("/:id", asyncHandler(productRouter.getProduct))
  .post(
    "/",
    upload("product").fields([
      { name: "mainImage", maxCount: 1 },
      { name: "coverImage", maxCount: 5 },
    ]),validation(productValidation),
    asyncHandler(productRouter.addProduct)
  )
  // .put(
  //   "/:id",
  //   upload("product").fields([
  //     { name: "mainImage", maxCount: 1 },
  //     { name: "coverImage", maxCount: 5 },
  //   ]),
  //   asyncHandler(productRouter.updateProduct)
  // )
  .delete("/:id", asyncHandler(productRouter.deleteProduct));

export default router;
