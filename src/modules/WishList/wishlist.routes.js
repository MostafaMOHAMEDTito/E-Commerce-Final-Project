import { Router } from "express";
import * as wishlistRouter from "./controller/wishlist.controller.js";
import asyncHandler from "../../middleware/asyncHandler.js";
import { authentication } from "../../middleware/authentication.js";
import authorization from "../../middleware/authorization.js";
import roles from "../../Types/roles.js";

const router = Router();

router
  .get(
    "/",
    authentication,
    authorization([roles.admin]),
    asyncHandler(wishlistRouter.getWishlists)
  )
  .get(
    "/user",
    authentication,
    authorization([roles.admin, roles.user]),
    asyncHandler(wishlistRouter.getUserWishlist)
  )
  .post(
    "/",
    authentication,
    authorization([roles.admin, roles.user]),
    asyncHandler(wishlistRouter.addWishlistItem)
  )
  .post(
    "/coupon",
    authentication,
    authorization([roles.admin, roles.user]),
    asyncHandler(wishlistRouter.applyWishlistCoupon)
  )
  .patch(
    "/:id",
    authentication,
    authorization([roles.admin, roles.user]),
    asyncHandler(wishlistRouter.deleteWishlistItem)
  )
  .put(
    "/",
    authentication,
    authorization([roles.admin, roles.user]),
    asyncHandler(wishlistRouter.updateQuantityforProductInWishlist)
  )
  .delete(
    "/:id",
    authentication,
    authorization([roles.admin]),
    asyncHandler(wishlistRouter.deleteWishlist)
  );
export default router;
