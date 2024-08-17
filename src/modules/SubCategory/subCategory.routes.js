import { Router } from "express";
import * as subcategoryRouter from "./controller/subCategory.controller.js";
import asyncHandler from "../../middleware/asyncHandler.js";
import upload from "../../middleware/upload.js";
import { addSubCategoryValidation } from "./subCategory.validation.js";
import validation from "../../middleware/validation.js";
import { authentication } from "../../middleware/authentication.js";
import authorization from "../../middleware/authorization.js";
import roles from "../../Types/roles.js";
const router = Router({ mergeParams: true });
router
  .get(
    "/",
    authentication,
    authorization([roles.admin]),
    asyncHandler(subcategoryRouter.getSubCategories)
  )
  .get(
    "/",
    authentication,
    authorization([roles.admin,roles.user]),
    asyncHandler(subcategoryRouter.getSubCategoriesByCategory)
  )
  .get("/:id", asyncHandler(subcategoryRouter.getSubCategory))
  .post(
    "/",
    upload("subCategory").single("image"),
    validation(addSubCategoryValidation),
    authentication,
    authorization([roles.admin]),
    asyncHandler(subcategoryRouter.addSubCategory)
  )
  .put(
    "/:id",
    upload("subCategory").single("image"),
    authentication,
    authorization([roles.admin]),
    asyncHandler(subcategoryRouter.updateSubCategory)
  )
  .delete(
    "/:id",
    authentication,
    authorization([roles.admin]),
    asyncHandler(subcategoryRouter.deleteSubCategory)
  );
export default router;
