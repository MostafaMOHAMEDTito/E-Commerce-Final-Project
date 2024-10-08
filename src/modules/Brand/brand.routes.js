import { Router } from "express";
import * as brandRouter from "./controller/brand.controller.js";
import asyncHandler from "../../middleware/asyncHandler.js";
import upload from "../../middleware/upload.js";
import { addBrandValidation } from "./brand.validation.js";
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
    asyncHandler(brandRouter.getBrands)
  )
  .get(
    "/:id",
    authentication,
    authorization([roles.admin, roles.user]),
    asyncHandler(brandRouter.getBrand)
  )
  .post(
    "/",
    upload("brand").single("image"),
    validation(addBrandValidation),
    authentication,
    authorization([roles.admin]),
    asyncHandler(brandRouter.addBrand)
  )
  .put(
    "/:id",
    upload("brand").single("image"),
    authentication,
    authorization([roles.admin]),
    asyncHandler(brandRouter.updateBrand)
  )
  .delete(
    "/:id",
    authentication,
    authorization([roles.admin]),
    asyncHandler(brandRouter.deleteBrand)
  );
export default router;
