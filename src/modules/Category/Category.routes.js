import { Router } from "express";
import * as categoryRouter from "./controller/category.controller.js";
import asyncHandler from "../../middleware/asyncHandler.js";
import upload from "../../middleware/upload.js";
import SubCategory from "../SubCategory/subCategory.routes.js";
import { addCategoryValidation } from "./category.validation.js";
import validation from "../../middleware/validation.js";
const router = Router();
router
  .get("/", asyncHandler(categoryRouter.getCategories))
  .get("/:id", asyncHandler(categoryRouter.getcategory))
  .post(
    "/",
    upload("category").single("image"),
    validation(addCategoryValidation),
    asyncHandler(categoryRouter.addCategory)
  )
  .put(
    "/:id",
    upload("category").single("image"),
    asyncHandler(categoryRouter.updateCategory)
  )
  .delete("/:id", asyncHandler(categoryRouter.deleteCategory))
  .use("/:id/subCategory", SubCategory);
export default router;
