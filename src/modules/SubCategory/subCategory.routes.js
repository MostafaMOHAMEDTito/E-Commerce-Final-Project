import { Router } from "express";
import * as subcategoryRouter from "./controller/subCategory.controller.js";
import asyncHandler from "../../middleware/asyncHandler.js";
import upload from "../../middleware/upload.js";
import { addSubCategoryValidation } from "./subCategory.validation.js";
import validation from "../../middleware/validation.js";
const router = Router({mergeParams : true});
router
  .get("/", asyncHandler(subcategoryRouter.getSubCategories))
  .get("/", asyncHandler(subcategoryRouter.getSubCategoriesByCategory))
  .get("/:id", asyncHandler(subcategoryRouter.getSubCategory))
  .post("/", upload("subCategory").single("image"), validation(addSubCategoryValidation) ,asyncHandler(subcategoryRouter.addSubCategory))
  .put("/:id",upload("subCategory").single("image"), asyncHandler(subcategoryRouter.updateSubCategory))
  .delete("/:id", asyncHandler(subcategoryRouter.deleteSubCategory));
export default router;
