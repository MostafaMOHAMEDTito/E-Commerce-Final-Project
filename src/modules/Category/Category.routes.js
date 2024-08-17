import { Router } from "express";
import * as categoryRouter from "./controller/category.controller.js";
import asyncHandler from "../../middleware/asyncHandler.js";
import upload from "../../middleware/upload.js";
import SubCategory from "../SubCategory/subCategory.routes.js";
import { addCategoryValidation } from "./category.validation.js";
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
    asyncHandler(categoryRouter.getCategories)
  )
  .get(
    "/:id",
    authentication,
    authorization([roles.admin, roles.user]),
    asyncHandler(categoryRouter.getcategory)
  )
  .post(
    "/",
    upload("category").single("image"),
    validation(addCategoryValidation),
    authentication,
    authorization([roles.admin]),
    asyncHandler(categoryRouter.addCategory)
  )
  .put(
    "/:id",
    upload("category").single("image"),
    authentication,
    authorization([roles.admin]),
    asyncHandler(categoryRouter.updateCategory)
  )
  .delete(
    "/:id",
    authentication,
    authorization([roles.admin]),
    asyncHandler(categoryRouter.deleteCategory)
  )
  .use("/:id/subCategory", SubCategory);
export default router;
