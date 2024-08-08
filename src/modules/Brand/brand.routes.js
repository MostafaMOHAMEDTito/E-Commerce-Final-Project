import { Router } from "express";
import * as brandRouter from "./controller/brand.controller.js";
import asyncHandler from "../../middleware/asyncHandler.js";
import upload from "../../middleware/upload.js";
import { addBrandValidation } from "./brand.validation.js";
import validation from "../../middleware/validation.js";
const router = Router();
router
  .get("/", asyncHandler(brandRouter.getBrands))
  .get("/:id", asyncHandler(brandRouter.getBrand))
  .post("/",upload("brand").single("image"),validation(addBrandValidation) ,asyncHandler(brandRouter.addBrand))
  .put("/:id",upload("brand").single("image"), asyncHandler(brandRouter.updateBrand))
  .delete("/:id", asyncHandler(brandRouter.deleteBrand));
export default router;
